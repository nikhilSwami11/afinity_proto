"""
Affinity map seeding script.

Run from backend/ directory:
    python -m scripts.seed_map

What it does:
  1. Embeds 35 fake users (7 thought camps × 5 users each)
  2. Runs UMAP to produce a 2D layout
  3. Shows a matplotlib plot so you can validate the clusters
  4. Asks for confirmation, then writes to Postgres

Prerequisites:
    pip install sentence-transformers umap-learn numpy matplotlib sqlalchemy psycopg[binary] pydantic-settings
"""

import json
import sys
import numpy as np

# ---------------------------------------------------------------------------
# Seed data — 35 users, 7 camps, 5 users each, 3–4 thoughts each
# ---------------------------------------------------------------------------

SEED_USERS = [
    # ── Camp 1: Introspection / Identity ───────────────────────────────────
    {
        "name": "Mira",
        "camp": "introspection",
        "themes": ["identity", "honesty", "self-knowledge"],
        "thoughts": [
            "I think honesty about contradiction is rarer than intelligence.",
            "The most interesting people I know are still figuring themselves out.",
            "I admire people who can hold doubt without losing moral courage.",
            "Knowing what you feel is harder than knowing what you think.",
        ],
    },
    {
        "name": "Selin",
        "camp": "introspection",
        "themes": ["identity", "emotional precision", "inner life"],
        "thoughts": [
            "Emotional precision matters more to me than emotional expressiveness.",
            "I distrust people who are never confused about themselves.",
            "The gap between who I am and who I seem to be is where I live.",
            "Introspection without honesty is just storytelling.",
        ],
    },
    {
        "name": "Rohan",
        "camp": "introspection",
        "themes": ["self-knowledge", "authenticity"],
        "thoughts": [
            "Most people perform a version of themselves and forget it's a performance.",
            "I want to understand what I actually believe, not what I think I should believe.",
            "The things I avoid thinking about tell me the most about myself.",
        ],
    },
    {
        "name": "Freya",
        "camp": "introspection",
        "themes": ["identity", "contradiction", "growth"],
        "thoughts": [
            "I contain contradictions I've stopped trying to resolve.",
            "Growth isn't becoming consistent — it's becoming more honest about the inconsistency.",
            "I'm most myself in conversations where I forget to perform.",
        ],
    },
    {
        "name": "Caden",
        "camp": "introspection",
        "themes": ["self-knowledge", "honesty"],
        "thoughts": [
            "I trust people who can say 'I don't know myself well enough to answer that.'",
            "The stories we tell about ourselves are usually the last things we should trust.",
            "Most self-improvement is just self-performance with better metrics.",
        ],
    },

    # ── Camp 2: Systems / Structure ─────────────────────────────────────────
    {
        "name": "Priya",
        "camp": "systems",
        "themes": ["incentives", "structure", "mechanisms"],
        "thoughts": [
            "Most problems are incentive problems in disguise.",
            "If you want to understand behavior, map the incentives first.",
            "Good systems produce good outcomes without requiring good people.",
            "Complexity is usually a failure of design, not an inherent property.",
        ],
    },
    {
        "name": "Lars",
        "camp": "systems",
        "themes": ["patterns", "first principles", "structure"],
        "thoughts": [
            "I think in systems before I think in solutions.",
            "Every problem that feels intractable is missing a level of abstraction.",
            "The right constraint is more powerful than the right answer.",
        ],
    },
    {
        "name": "Kenji",
        "camp": "systems",
        "themes": ["mechanisms", "leverage", "design"],
        "thoughts": [
            "Leverage is always structural. You either design it in or luck into it.",
            "Most organizations fail at the interface between systems, not inside them.",
            "The worst kind of complexity is the kind nobody designed — it just accumulated.",
        ],
    },
    {
        "name": "Anika",
        "camp": "systems",
        "themes": ["incentives", "behavior", "feedback loops"],
        "thoughts": [
            "Feedback loops explain most of history.",
            "When the incentives change, the people stay the same but the behavior changes.",
            "I model institutions before I judge the individuals inside them.",
        ],
    },
    {
        "name": "Theo",
        "camp": "systems",
        "themes": ["design", "emergence", "structure"],
        "thoughts": [
            "Emergent behavior is not magic — it's the part you didn't design.",
            "The best designs solve for failure modes before they solve for the happy path.",
            "Simple rules produce complex outcomes. Complex rules produce chaos.",
        ],
    },

    # ── Camp 3: Belonging / Connection ──────────────────────────────────────
    {
        "name": "Jonah",
        "camp": "belonging",
        "themes": ["connection", "community", "being known"],
        "thoughts": [
            "Most people want acceptance but call it independence.",
            "The loneliness epidemic is really an attention epidemic.",
            "Being truly known by even one person changes what you think is possible.",
        ],
    },
    {
        "name": "Nadia",
        "camp": "belonging",
        "themes": ["relationships", "intimacy", "belonging"],
        "thoughts": [
            "I measure the quality of my life by the quality of my conversations.",
            "Belonging isn't about fitting in — it's about being kept.",
            "I think loneliness is mostly about not being witnessed, not about being alone.",
        ],
    },
    {
        "name": "Eli",
        "camp": "belonging",
        "themes": ["community", "friendship", "social bonds"],
        "thoughts": [
            "Real friendship is the willingness to be inconvenient for someone.",
            "The relationships that last are the ones where both people chose to keep choosing.",
            "I think belonging to a place matters as much as belonging to people.",
        ],
    },
    {
        "name": "Zara",
        "camp": "belonging",
        "themes": ["connection", "vulnerability", "trust"],
        "thoughts": [
            "Vulnerability is not weakness — it's the price of actual connection.",
            "I'm suspicious of people who don't need anyone.",
            "The things I share with very few people are the things that feel most true.",
        ],
    },
    {
        "name": "Marco",
        "camp": "belonging",
        "themes": ["community", "shared meaning", "belonging"],
        "thoughts": [
            "Shared rituals matter more than shared beliefs.",
            "The best communities are built around a practice, not an identity.",
            "I think humans are at their best when they're needed by other humans.",
        ],
    },

    # ── Camp 4: Certainty / Doubt ───────────────────────────────────────────
    {
        "name": "Leah",
        "camp": "doubt",
        "themes": ["certainty", "epistemology", "intellectual humility"],
        "thoughts": [
            "Strong opinions held loosely are rarer than advertised.",
            "I distrust certainty more than I distrust doubt.",
            "The most dangerous people are the ones who have stopped being curious.",
        ],
    },
    {
        "name": "Soren",
        "camp": "doubt",
        "themes": ["uncertainty", "knowledge limits", "questioning"],
        "thoughts": [
            "I think not knowing is underrated as a position.",
            "Most confident claims are confident about the wrong things.",
            "The question I return to most is whether my framework is the problem.",
        ],
    },
    {
        "name": "Iris",
        "camp": "doubt",
        "themes": ["intellectual humility", "belief revision", "doubt"],
        "thoughts": [
            "Changing your mind is the most undervalued intellectual skill.",
            "I've stopped being impressed by people who are always right.",
            "The belief I hold most tightly is probably the one most worth questioning.",
        ],
    },
    {
        "name": "Felix",
        "camp": "doubt",
        "themes": ["certainty", "epistemic humility"],
        "thoughts": [
            "Confidence that can't absorb new information isn't confidence — it's armor.",
            "I respect people who can articulate why they might be wrong.",
            "Most debates are really about the premises, not the conclusions.",
        ],
    },
    {
        "name": "Yuna",
        "camp": "doubt",
        "themes": ["uncertainty", "open questions", "wondering"],
        "thoughts": [
            "I am more interested in the questions I can't resolve than the ones I can.",
            "Sitting with uncertainty is a skill most people never develop.",
            "The right answer to most big questions starts with 'it depends.'",
        ],
    },

    # ── Camp 5: Change / Memory ─────────────────────────────────────────────
    {
        "name": "Hana",
        "camp": "memory",
        "themes": ["change", "memory", "time"],
        "thoughts": [
            "What we remember about people says more about us than them.",
            "The hardest lessons are often about what love cannot fix.",
            "I keep a record of who I used to be so I can measure the distance.",
        ],
    },
    {
        "name": "Malik",
        "camp": "memory",
        "themes": ["time", "growth", "past self"],
        "thoughts": [
            "I am not the same person who made my earliest decisions.",
            "Nostalgia is usually a longing for a simpler version of yourself.",
            "The past is not a place you can return to. Only study.",
        ],
    },
    {
        "name": "Astrid",
        "camp": "memory",
        "themes": ["change", "continuity", "becoming"],
        "thoughts": [
            "We change so slowly that we never quite believe we've changed.",
            "The version of me from five years ago would be a stranger now.",
            "I'm curious about what I'll think about my current beliefs in a decade.",
        ],
    },
    {
        "name": "Dani",
        "camp": "memory",
        "themes": ["memory", "loss", "time"],
        "thoughts": [
            "The things I've lost have shaped me more than the things I've kept.",
            "Memory is less a recording and more an interpretation that keeps updating.",
            "Some parts of the past feel more present than the present does.",
        ],
    },
    {
        "name": "Callum",
        "camp": "memory",
        "themes": ["becoming", "transformation", "past"],
        "thoughts": [
            "I think about who I'm becoming more than who I am.",
            "The arc of change is only visible in retrospect.",
            "What I want from my future self is the ability to be surprised.",
        ],
    },

    # ── Camp 6: Ambition / Meaning ──────────────────────────────────────────
    {
        "name": "Vera",
        "camp": "ambition",
        "themes": ["meaning", "purpose", "work"],
        "thoughts": [
            "Most people don't want success — they want permission.",
            "I want to do work that would embarrass me if I stopped caring about it.",
            "Meaning is the thing that makes discomfort feel like it's worth it.",
        ],
    },
    {
        "name": "Omar",
        "camp": "ambition",
        "themes": ["legacy", "contribution", "ambition"],
        "thoughts": [
            "I think about what I'm building more than what I'm achieving.",
            "The question I keep returning to is whether this matters beyond my own life.",
            "Ambition without direction is just restlessness.",
        ],
    },
    {
        "name": "Lena",
        "camp": "ambition",
        "themes": ["purpose", "drive", "meaningful work"],
        "thoughts": [
            "I don't want a comfortable life — I want a meaningful one.",
            "The projects I care most about are the ones I'd work on even if they failed.",
            "Knowing why you're doing something is harder than knowing how.",
        ],
    },
    {
        "name": "Diego",
        "camp": "ambition",
        "themes": ["ambition", "craft", "contribution"],
        "thoughts": [
            "I respect people who want to be excellent at something specific.",
            "Craft is the discipline of caring about details other people skip.",
            "I think the best work comes from people who can't not do it.",
        ],
    },
    {
        "name": "Noor",
        "camp": "ambition",
        "themes": ["meaning", "impact", "why"],
        "thoughts": [
            "The saddest version of a life is one where you never chose what it was for.",
            "Impact doesn't require scale — it requires intention.",
            "I want the things I make to outlast the reasons I made them.",
        ],
    },

    # ── Camp 7: Language / Truth ─────────────────────────────────────────────
    {
        "name": "Pita",
        "camp": "language",
        "themes": ["language", "precision", "truth"],
        "thoughts": [
            "The words we don't have for feelings are not accidents.",
            "Imprecise language hides imprecise thinking.",
            "I think naming something correctly is the first step toward understanding it.",
        ],
    },
    {
        "name": "Sia",
        "camp": "language",
        "themes": ["language", "meaning", "communication"],
        "thoughts": [
            "Most disagreements are about definitions pretending to be about facts.",
            "I slow down when someone uses a word I haven't fully examined.",
            "The things that are hardest to say are usually the most important to say.",
        ],
    },
    {
        "name": "Remy",
        "camp": "language",
        "themes": ["truth", "expression", "honesty"],
        "thoughts": [
            "I believe in saying the true thing even when the kind thing is available.",
            "Euphemism is often the language of avoidance.",
            "The gap between what I mean and what I say is where most misunderstanding lives.",
        ],
    },
    {
        "name": "Sasha",
        "camp": "language",
        "themes": ["language", "precision", "thought"],
        "thoughts": [
            "I think language shapes what you're able to think, not just what you say.",
            "When I can't articulate something, I usually don't understand it yet.",
            "The most powerful words are the ones that make someone feel seen.",
        ],
    },
    {
        "name": "Bram",
        "camp": "language",
        "themes": ["truth", "words", "honesty"],
        "thoughts": [
            "I distrust people who are never at a loss for words.",
            "Good writing forces you to discover what you actually believe.",
            "The words that land hardest are the ones you didn't plan to say.",
        ],
    },
]


def mean_embed(model, texts: list[str]) -> np.ndarray:
    embeddings = model.encode(texts, show_progress_bar=False, normalize_embeddings=True)
    return embeddings.mean(axis=0)


def cosine_sim(a: np.ndarray, b: np.ndarray) -> float:
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def run():
    print("── Affinity Map Seeding Script ──────────────────────────────")
    print(f"  Users: {len(SEED_USERS)} | Camps: 7\n")

    # 1. Load model
    print("Step 1/4  Loading sentence-transformers model (all-MiniLM-L6-v2)...")
    print("          First run downloads ~90 MB — needs internet.")
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer("all-MiniLM-L6-v2")
    print("          Model ready.\n")

    # 2. Embed each user (mean of their thoughts)
    print("Step 2/4  Embedding users...")
    embeddings = []
    for u in SEED_USERS:
        vec = mean_embed(model, u["thoughts"])
        embeddings.append(vec)
        print(f"          ✓ {u['name']} ({u['camp']})")
    embeddings = np.array(embeddings)
    print(f"\n          Embedding matrix: {embeddings.shape}\n")

    # 3. UMAP → 2D
    print("Step 3/4  Running UMAP...")
    import umap
    n_users = len(SEED_USERS)
    n_neighbors = min(7, n_users - 1)  # safe for small datasets
    reducer = umap.UMAP(
        n_components=2,
        n_neighbors=n_neighbors,
        min_dist=0.3,
        metric="cosine",
        random_state=42,
    )
    coords_2d = reducer.fit_transform(embeddings)

    # Validate: both axes must have variance (not degenerate)
    x_std = np.std(coords_2d[:, 0])
    y_std = np.std(coords_2d[:, 1])
    print(f"          x std: {x_std:.3f}  y std: {y_std:.3f}")
    if x_std < 0.3 or y_std < 0.3:
        print("\n  ⚠ WARNING: Low variance — map may look like a blob.")
        print("  Fix: make seed thoughts more stylistically distinct per camp.")

    # Normalize to [0, 1]
    x_min, x_max = coords_2d[:, 0].min(), coords_2d[:, 0].max()
    y_min, y_max = coords_2d[:, 1].min(), coords_2d[:, 1].max()
    x_norm = (coords_2d[:, 0] - x_min) / (x_max - x_min)
    y_norm = (coords_2d[:, 1] - y_min) / (y_max - y_min)
    print("          Coordinates normalized to [0, 1].\n")

    # 4. Matplotlib preview
    print("Step 4/4  Showing cluster plot...")
    print("          Close the plot window when you're done inspecting.")
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches

    camp_colors = {
        "introspection": "#7c3aed",
        "systems":       "#0891b2",
        "belonging":     "#16a34a",
        "doubt":         "#d97706",
        "memory":        "#db2777",
        "ambition":      "#dc2626",
        "language":      "#65a30d",
    }

    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_facecolor("#020817")
    fig.patch.set_facecolor("#020817")

    for i, user in enumerate(SEED_USERS):
        color = camp_colors[user["camp"]]
        ax.scatter(x_norm[i], y_norm[i], color=color, s=120, zorder=3, alpha=0.9)
        ax.annotate(
            user["name"],
            (x_norm[i], y_norm[i]),
            textcoords="offset points",
            xytext=(6, 4),
            fontsize=7,
            color="white",
            alpha=0.8,
        )

    legend_handles = [
        mpatches.Patch(color=c, label=camp)
        for camp, c in camp_colors.items()
    ]
    ax.legend(handles=legend_handles, loc="lower left", framealpha=0.3,
              labelcolor="white", facecolor="#1e1b4b", fontsize=8)
    ax.set_title("Affinity Seed Map — UMAP Clusters", color="white", pad=12)
    ax.tick_params(colors="gray")
    for spine in ax.spines.values():
        spine.set_edgecolor("#334155")

    plt.tight_layout()
    plt.show()

    # 5. Confirm before DB write
    print("\nDo the clusters look meaningful? (≥3 visible groups = good)")
    confirm = input("Seed the database? [y/N]: ").strip().lower()
    if confirm != "y":
        print("Aborted. Re-run when the plot looks right.")
        sys.exit(0)

    # 6. Write to Postgres
    print("\nWriting to Postgres...")
    import sqlalchemy as sa
    from sqlalchemy import text

    # Import settings from the app
    sys.path.insert(0, ".")
    from app.core.config import settings

    engine = sa.create_engine(settings.DATABASE_URL)

    # Drop and recreate to pick up schema changes (camp column)
    create_table_sql = """
    DROP TABLE IF EXISTS seed_users;
    CREATE TABLE seed_users (
        id        SERIAL PRIMARY KEY,
        name      TEXT NOT NULL,
        excerpt   TEXT NOT NULL,
        themes    TEXT[] NOT NULL,
        camp      TEXT NOT NULL,
        embedding JSONB NOT NULL,
        map_x     FLOAT NOT NULL,
        map_y     FLOAT NOT NULL
    );
    """

    with engine.begin() as conn:
        conn.execute(text(create_table_sql))

        for i, user in enumerate(SEED_USERS):
            conn.execute(
                text("""
                    INSERT INTO seed_users (name, excerpt, themes, camp, embedding, map_x, map_y)
                    VALUES (:name, :excerpt, :themes, :camp, cast(:embedding as jsonb), :map_x, :map_y)
                """),
                {
                    "name":      user["name"],
                    "excerpt":   user["thoughts"][0],
                    "themes":    user["themes"],
                    "camp":      user["camp"],
                    "embedding": json.dumps(embeddings[i].tolist()),
                    "map_x":     float(x_norm[i]),
                    "map_y":     float(y_norm[i]),
                },
            )
            print(f"  ✓ {user['name']}")

    print(f"\n✓ {len(SEED_USERS)} seed users written to Postgres.")
    print("  Next: implement GET /api/v1/map/users and POST /api/v1/map/position")


if __name__ == "__main__":
    run()
