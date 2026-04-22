"""Map service layer."""
import json

import numpy as np
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.features.thoughts.models import Thought


def _cosine_sim(a: list[float], b: list[float]) -> float:
    va, vb = np.array(a), np.array(b)
    norm_a, norm_b = np.linalg.norm(va), np.linalg.norm(vb)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(va, vb) / (norm_a * norm_b))


def get_all_seed_users(db: Session) -> list[dict]:
    rows = db.execute(
        text("SELECT id, name, excerpt, themes, camp, map_x, map_y FROM seed_users")
    ).fetchall()
    return [row._mapping for row in rows]


def compute_position(db: Session, model, answers: list[str]) -> dict:
    non_empty = [a.strip() for a in answers if a.strip()]
    embeddings = model.encode(non_empty, normalize_embeddings=True)
    user_vec = embeddings.mean(axis=0).tolist()

    rows = db.execute(
        text("SELECT id, name, embedding, map_x, map_y FROM seed_users")
    ).fetchall()

    if not rows:
        return {"x": 0.5, "y": 0.5, "low_signal": True}

    scored = []
    for row in rows:
        seed_embedding = json.loads(row.embedding) if isinstance(row.embedding, str) else row.embedding
        sim = _cosine_sim(user_vec, seed_embedding)
        scored.append((sim, row.map_x, row.map_y))

    scored.sort(key=lambda t: t[0], reverse=True)
    top_k = scored[:3]
    low_signal = top_k[0][0] < 0.3

    total_weight = sum(s for s, _, _ in top_k)
    if total_weight == 0:
        return {"x": 0.5, "y": 0.5, "low_signal": True}

    x = sum(s * px for s, px, _ in top_k) / total_weight
    y = sum(s * py for s, _, py in top_k) / total_weight
    x = max(0.1, min(0.9, x))
    y = max(0.1, min(0.9, y))

    return {"x": x, "y": y, "low_signal": low_signal}


def recalculate_position_from_thoughts(db: Session, model, user_id: int) -> dict | None:
    thoughts = (
        db.query(Thought)
        .filter(Thought.user_id == user_id, Thought.status == "published")
        .all()
    )
    if not thoughts:
        return None

    texts = [t.content for t in thoughts]
    result = compute_position(db, model, texts)

    db.execute(
        text("UPDATE users SET map_x = :x, map_y = :y WHERE id = :id"),
        {"x": result["x"], "y": result["y"], "id": user_id},
    )
    db.commit()
    return result
