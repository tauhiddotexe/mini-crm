from app.database import get_connection
from datetime import datetime, timezone
import uuid


def generate_ticket_id() -> str:
    return f"TKT-{uuid.uuid4().hex[:8].upper()}"


def create_ticket(customer_name: str, customer_email: str, subject: str, description: str) -> dict:
    conn = get_connection()
    cur = conn.cursor()
    try:
        ticket_id = generate_ticket_id()
        now = datetime.now(timezone.utc)
        cur.execute(
            """INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description, status, created_at, updated_at)
               VALUES (%s, %s, %s, %s, %s, 'Open', %s, %s)
               RETURNING ticket_id, created_at""",
            (ticket_id, customer_name, customer_email, subject, description, now, now),
        )
        result = cur.fetchone()
        conn.commit()
        return dict(result)
    finally:
        cur.close()
        conn.close()


def list_tickets(status: str | None = None, search: str | None = None) -> list[dict]:
    conn = get_connection()
    cur = conn.cursor()
    try:
        query = "SELECT ticket_id, customer_name, subject, status, created_at FROM tickets"
        conditions = []
        params = []

        if status:
            conditions.append("status = %s")
            params.append(status)

        if search:
            conditions.append(
                "(ticket_id ILIKE %s OR customer_name ILIKE %s OR customer_email ILIKE %s OR subject ILIKE %s OR description ILIKE %s)"
            )
            search_term = f"%{search}%"
            params.extend([search_term] * 5)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += " ORDER BY created_at DESC"

        cur.execute(query, params)
        rows = cur.fetchall()
        return [dict(row) for row in rows]
    finally:
        cur.close()
        conn.close()


def get_ticket(ticket_id: str) -> dict | None:
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT ticket_id, customer_name, customer_email, subject, description, status FROM tickets WHERE ticket_id = %s",
            (ticket_id,),
        )
        ticket = cur.fetchone()
        if not ticket:
            return None

        cur.execute(
            "SELECT id, note_text, created_at FROM notes WHERE ticket_id = %s ORDER BY created_at DESC",
            (ticket_id,),
        )
        notes = [dict(n) for n in cur.fetchall()]
        result = dict(ticket)
        result["notes"] = notes
        return result
    finally:
        cur.close()
        conn.close()


def update_ticket(ticket_id: str, status: str | None = None, note_text: str | None = None) -> dict | None:
    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT ticket_id FROM tickets WHERE ticket_id = %s", (ticket_id,))
        if not cur.fetchone():
            return None

        now = datetime.now(timezone.utc)

        if status:
            cur.execute(
                "UPDATE tickets SET status = %s, updated_at = %s WHERE ticket_id = %s",
                (status, now, ticket_id),
            )

        if note_text:
            cur.execute(
                "INSERT INTO notes (ticket_id, note_text, created_at) VALUES (%s, %s, %s)",
                (ticket_id, note_text, now),
            )

        conn.commit()
        return {"success": True, "updated_at": now}
    finally:
        cur.close()
        conn.close()
