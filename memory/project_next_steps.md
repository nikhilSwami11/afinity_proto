---
name: Profile + Auth Module — Next Steps
description: Current build status and what was planned for the next session (profile module, onboarding redesign, Google OAuth)
type: project
---

The map module is complete (frontend + backend). Seeding script at `backend/scripts/seed_map.py` is done and documented in the README.

## What was planned next (profile module)

The user wants to build three things as one coherent module:

1. **Google OAuth auth** — `@react-oauth/google` on the frontend, FastAPI verifies the Google ID token and issues its own JWT. No email/password fallback needed for the prototype. User needs to set up a Google Cloud Console OAuth 2.0 Client ID (localhost:3000 as authorized origin).

2. **User creation** — First Google sign-in creates a user row in the DB. Name + email pre-filled from Google. Backend `User` model + `POST /api/v1/auth/google` endpoint.

3. **Onboarding redesign** — Since name comes from Google, onboarding is purely the thought prompts (no profile info step needed). After prompts → POST /api/v1/map/position → create profile → enter app.

4. **Profile page** — Connect to real API. Show: name (from Google), onboarding answers, published thoughts (GET /api/v1/thoughts/me), mini-map with user's position.

5. **Backend profiles module** — Currently a stub. Needs: Profile model (user_id FK, map_x, map_y, themes, onboarding_answers JSONB), POST /api/v1/profile, GET /api/v1/profile/me.

6. **Replace user_id=1 stub** — All routes currently hardcode user_id=1. Real auth replaces this with the JWT-decoded user ID.

## Why: The motivation
Without auth, profile page shows the same hardcoded "Satyam" for everyone. With Google auth, onboarding creates YOUR account, your dot lands on the map, your profile shows your thoughts. The social network concept becomes real.

**How to apply:** When resuming, start with backend Google auth endpoint first, then User model + migration, then wire frontend Google button, then profile page.
