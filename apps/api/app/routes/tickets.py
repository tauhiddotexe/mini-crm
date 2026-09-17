from fastapi import APIRouter, HTTPException, Query
from typing import Literal, Optional

from app.schemas import (
    TicketCreate,
    TicketUpdate,
    TicketResponse,
    TicketListItem,
    TicketDetail,
    UpdateResponse,
)
from app.services import tickets as ticket_service

router = APIRouter()

VALID_STATUSES = {"Open", "In Progress", "Closed"}


@router.post("/tickets", response_model=TicketResponse, status_code=201)
def create_ticket(ticket: TicketCreate):
    result = ticket_service.create_ticket(
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
    )
    return result


@router.get("/tickets", response_model=list[TicketListItem])
def list_tickets(
    status: Optional[Literal["Open", "In Progress", "Closed"]] = Query(None),
    search: Optional[str] = Query(None, max_length=200),
):
    if status and status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")
    return ticket_service.list_tickets(status=status, search=search)


@router.get("/tickets/{ticket_id}", response_model=TicketDetail)
def get_ticket(ticket_id: str):
    ticket = ticket_service.get_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.put("/tickets/{ticket_id}", response_model=UpdateResponse)
def update_ticket(ticket_id: str, update: TicketUpdate):
    if update.status and update.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")

    result = ticket_service.update_ticket(
        ticket_id=ticket_id,
        status=update.status,
        note_text=update.notes,
    )

    if not result:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return result
