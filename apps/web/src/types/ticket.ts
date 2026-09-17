export interface Ticket {
  ticket_id: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Closed";
  created_at: string;
  updated_at: string;
}

export interface TicketListItem {
  ticket_id: string;
  customer_name: string;
  subject: string;
  status: "Open" | "In Progress" | "Closed";
  created_at: string;
}

export interface Note {
  id: number;
  note_text: string;
  created_at: string;
}

export interface TicketDetail extends Ticket {
  notes: Note[];
}

export interface TicketCreate {
  customer_name: string;
  customer_email: string;
  subject: string;
  description: string;
}

export interface TicketUpdate {
  status?: "Open" | "In Progress" | "Closed";
  notes?: string;
}
