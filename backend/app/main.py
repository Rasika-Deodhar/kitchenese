import os
import sys

from dotenv import load_dotenv

load_dotenv()

if not os.environ.get("GROQ_API_KEY"):
    sys.exit(
        "FATAL: GROQ_API_KEY environment variable is not set. "
        "Copy .env.example to .env and add your Groq API key before starting the server."
    )

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.groq_client import GroqError, call_groq
from app.prompts import build_system_prompt, build_user_prompt
from app.schemas import AnalogyRequest, AnalogyResponse

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Kitchenese API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"error": "Too many requests. Please wait a moment and try again."},
    )


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/analogy")
@limiter.limit("12/minute")
async def analogy(request: Request):
    try:
        body = await request.json()
        payload = AnalogyRequest(**body)
    except ValidationError as exc:
        return JSONResponse(
            status_code=422,
            content={"error": "Invalid input.", "details": exc.errors(include_context=False, include_url=False)},
        )
    except Exception:
        return JSONResponse(status_code=400, content={"error": "Malformed request body."})

    system_prompt = build_system_prompt(payload.mode, payload.cuisine)
    user_prompt = build_user_prompt(payload.concept)

    try:
        raw = await call_groq(system_prompt, user_prompt)
    except GroqError as exc:
        return JSONResponse(status_code=502, content={"error": str(exc)})

    try:
        validated = AnalogyResponse(**raw)
    except ValidationError as exc:
        return JSONResponse(
            status_code=502,
            content={
                "error": "Model returned a response that didn't match the expected format.",
                "details": exc.errors(include_context=False, include_url=False),
            },
        )

    return validated.model_dump()
