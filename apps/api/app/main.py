from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import traceback

from app.routes import tickets

load_dotenv()

app = FastAPI(title="Support CRM API", version="1.0.0")

DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://mini-crm-spsy.vercel.app",
]

env_origins = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", "").split(",")
    if o.strip()
]
allowed_origins = list(dict.fromkeys(DEFAULT_CORS_ORIGINS + env_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    is_debug = os.getenv("DEBUG")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc) if is_debug else "Internal server error"},
    )


app.include_router(tickets.router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
