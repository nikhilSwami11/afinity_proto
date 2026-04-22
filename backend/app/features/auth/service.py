"""Auth service layer."""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.features.auth import repository
from app.features.auth.schemas import LoginRequest, RegisterRequest, TokenResponse


def register(db: Session, payload: RegisterRequest) -> TokenResponse:
    if repository.get_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered.")
    if repository.get_by_username(db, payload.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already taken.")

    user = repository.create_user(
        db,
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(payload.password),
    )
    return TokenResponse(
        access_token=create_access_token(user.id),
        user_id=user.id,
        username=user.username,
    )


def login(db: Session, payload: LoginRequest) -> TokenResponse:
    user = repository.get_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    return TokenResponse(
        access_token=create_access_token(user.id),
        user_id=user.id,
        username=user.username,
    )
