from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional
from datetime import datetime


class TicketCreate(BaseModel):
    customer_name: str = Field(max_length=255)
    customer_email: EmailStr
    subject: str = Field(max_length=500)
    description: str = Field(max_length=10000)


class TicketUpdate(BaseModel):
    status: Optional[Literal["Open", "In Progress", "Closed"]] = None
    notes: Optional[str] = Field(None, max_length=5000)


class NoteResponse(BaseModel):
    id: int
    note_text: str
    created_at: datetime


class TicketResponse(BaseModel):
    ticket_id: str
    created_at: datetime


class TicketListItem(BaseModel):
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    created_at: datetime


class TicketDetail(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    notes: list[NoteResponse]


class UpdateResponse(BaseModel):
    success: bool
    updated_at: datetime
