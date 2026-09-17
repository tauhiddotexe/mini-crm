import httpx
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")


def create_ticket(ticket_data: dict) -> dict | None:
    try:
        response = httpx.post(
            f"{API_BASE_URL}/api/tickets",
            json=ticket_data,
            timeout=10.0,
        )
        if response.status_code == 201:
            return response.json()
        return None
    except httpx.RequestError:
        return None
