"""Map service layer."""
import json
import math

import numpy as np
from sqlalchemy import text
from sqlalchemy.orm import Session


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
    """
    Embed the user's onboarding answers, find K=3 nearest seed users by
    cosine similarity, return the weighted centroid position clamped to [0.1, 0.9].
    """
    # Embed answers and take the mean vector
    non_empty = [a.strip() for a in answers if a.strip()]
    embeddings = model.encode(non_empty, normalize_embeddings=True)
    user_vec = embeddings.mean(axis=0).tolist()

    # Load seed users with embeddings
    rows = db.execute(
        text("SELECT id, name, embedding, map_x, map_y FROM seed_users")
    ).fetchall()

    if not rows:
        return {"x": 0.5, "y": 0.5, "low_signal": True}

    # Compute cosine similarity for each seed user
    scored = []
    for row in rows:
        seed_embedding = json.loads(row.embedding) if isinstance(row.embedding, str) else row.embedding
        sim = _cosine_sim(user_vec, seed_embedding)
        scored.append((sim, row.map_x, row.map_y))

    # Sort by similarity descending, take top K=3
    scored.sort(key=lambda t: t[0], reverse=True)
    top_k = scored[:3]

    # Check if signal is weak (all similarities below threshold)
    low_signal = top_k[0][0] < 0.3

    # Weighted centroid
    total_weight = sum(s for s, _, _ in top_k)
    if total_weight == 0:
        return {"x": 0.5, "y": 0.5, "low_signal": True}

    x = sum(s * px for s, px, _ in top_k) / total_weight
    y = sum(s * py for s, _, py in top_k) / total_weight

    # Clamp to inner bounding box so the dot never lands at the canvas edge
    x = max(0.1, min(0.9, x))
    y = max(0.1, min(0.9, y))

    return {"x": x, "y": y, "low_signal": low_signal}
