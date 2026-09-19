from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.routes import tickets

load_dotenv()

app = FastAPI(title="Support CRM API", version="1.0.0")

DEFAULT_CORS_ORIGINS = ",".join([
    "http://localhost:5173",
    "http://localhost:5174",
    "https://mini-crm-spsy.vercel.app",
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", DEFAULT_CORS_ORIGINS).split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(tickets.router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
