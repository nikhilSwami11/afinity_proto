# Affinity Proto

**A living map of minds**

A prototype for publishing thoughts, discovering aligned people, and exploring connection through ideas.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs\&logoColor=white)
![React](https://img.shields.io/badge/React-19-20232A?logo=react\&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi\&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00?logo=sqlalchemy\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql\&logoColor=white)
![Alembic](https://img.shields.io/badge/Alembic-Migrations-222222)

## Overview

Affinity is a full-stack prototype built around a simple idea: people should be discoverable through what they think, not just through profile metadata. The repository currently includes a modern frontend prototype, a feature-structured FastAPI backend, PostgreSQL-backed persistence, and an ML workspace for future embedding and placement logic.

## Tech Stack

### Frontend

* Next.js 16

* React 19

* TypeScript 5

* Tailwind CSS 4

* Radix UI

* Motion

* Lucide React

### Backend

* Python 3

* FastAPI

* SQLAlchemy 2

* Alembic

* Psycopg 3

* Pydantic Settings

* Uvicorn

### Data and Tooling

* PostgreSQL

* npm

* Python `venv`

* ESLint

## Repository Structure

```text
Afinity_Proto/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── thoughts/
│   │   │   ├── profiles/
│   │   │   ├── embeddings/
│   │   │   ├── matching/
│   │   │   ├── discover/
│   │   │   └── map/
│   │   ├── shared/
│   │   └── main.py
│   ├── scripts/
│   │   └── seed_map.py
│   ├── alembic/
│   ├── alembic.ini
│   ├── docker-compose.yml
│   └── requirements.txt
├── frontend/
│   ├── src/app/
│   ├── src/components/
│   └── package.json
└── ml/
```

## Features

* Thought-first product direction focused on expression, discovery, and alignment

* Next.js prototype with landing, onboarding, home, write, discover, placement, profile, and settings flows

* FastAPI backend organized by feature modules for future scale

* Alembic migrations and SQLAlchemy models for PostgreSQL persistence

* Dedicated `ml/` directory for embeddings, similarity, and placement experimentation

## Getting Started

### Prerequisites

* Node.js and npm

* Python 3

* PostgreSQL

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn sqlalchemy alembic 'psycopg[binary]' pydantic-settings
```

### Database Setup

Create a PostgreSQL database, then set the connection string in `backend/alembic.ini`.

Example:

```ini
sqlalchemy.url = postgresql+psycopg://postgres:password@localhost:5432/afinity
```

Run migrations:

```bash
cd backend
source .venv/bin/activate
alembic upgrade head
```

Generate a new migration after model changes:

```bash
alembic revision --autogenerate -m "describe your change"
alembic upgrade head
```

### Run The Backend

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### Seeding the Map

`backend/scripts/seed_map.py` populates the database with 35 fake users across 7 philosophical "thought camps" (introspection, systems, belonging, doubt, memory, ambition, language). Each user is embedded via a sentence-transformer model, reduced to 2D coordinates with UMAP, and written to a `seed_users` table in Postgres.

**Install the extra dependencies:**

```bash
cd backend
source .venv/bin/activate
pip install sentence-transformers umap-learn numpy matplotlib
```

> The first run downloads the `all-MiniLM-L6-v2` model (~90 MB) — an internet connection is required.

**Run the script:**

```bash
cd backend
source .venv/bin/activate
python -m scripts.seed_map
```

The script will:

1. Embed all 35 users using their seed thoughts
2. Run UMAP to produce a 2D layout
3. Open a matplotlib cluster plot so you can validate the groups visually
4. Prompt for confirmation before writing to Postgres

If the plot shows at least 3 distinct clusters, enter `y` to commit. The `seed_users` table is dropped and recreated on each run, so re-running with modified seed data is safe.

## Current Status

* The frontend is currently the most complete part of the product experience.

* The backend has the new feature-based structure in place and includes the thoughts flow scaffold.

* The ML scripts are placeholders and are ready for future implementation.

## Next Improvements

* Move backend dependencies into `backend/requirements.txt`

* Fill out `backend/docker-compose.yml` for PostgreSQL and app services

* Add environment-based configuration for database credentials

* Expand auth, profiles, matching, and discover feature implementations
