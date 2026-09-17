import type { Ticket, TicketListItem, TicketDetail, TicketCreate, TicketUpdate } from "@/types/ticket";

const BASE = import.meta.env.VITE_API_BASE ?? "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  createTicket: (data: TicketCreate) =>
    request<Ticket>("/tickets", { method: "POST", body: JSON.stringify(data) }),

  listTickets: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return request<TicketListItem[]>(`/tickets${qs ? `?${qs}` : ""}`);
  },

  getTicket: (ticketId: string) => request<TicketDetail>(`/tickets/${ticketId}`),

  updateTicket: (ticketId: string, data: TicketUpdate) =>
    request<{ success: boolean; updated_at: string }>(`/tickets/${ticketId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
