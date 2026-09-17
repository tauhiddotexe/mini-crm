import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, User, Mail, Calendar } from "lucide-react";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardContent } from "@/components/Card";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Input";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/components/Toast";
import { NotesEmptyState, TicketNotFoundState } from "@/components/EmptyState";
import { LoadingIllustration } from "@/components/Illustrations";
import type { TicketDetail as TicketDetailType } from "@/types/ticket";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
};

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const { show, ToastComponent } = useToast();
  const [ticket, setTicket] = useState<TicketDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getTicket(id).then(setTicket).finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!id || !ticket) return;
    try {
      await api.updateTicket(id, { status: newStatus as TicketDetailType["status"] });
      setTicket({ ...ticket, status: newStatus as TicketDetailType["status"] });
      show("Status updated successfully");
    } catch {
      show("Failed to update status", "error");
    }
  }

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !newNote.trim()) return;

    setAddingNote(true);
    try {
      await api.updateTicket(id, { notes: newNote });
      setNewNote("");
      const updated = await api.getTicket(id);
      setTicket(updated);
      show("Note added successfully");
    } catch {
      show("Failed to add note", "error");
    } finally {
      setAddingNote(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="w-full h-72">
          <LoadingIllustration />
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-3xl mx-auto">
        <TicketNotFoundState
          action={
            <Link to="/tickets">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to tickets
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div {...fadeIn} className="flex items-center gap-3">
        <Link to="/tickets" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{ticket.ticket_id}</h1>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Created {formatDateTime(ticket.created_at)}
          </p>
        </div>
      </motion.div>

      <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.05 }}>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold">Details</h2>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</p>
                  <p className="text-sm font-medium mt-0.5">{ticket.customer_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium mt-0.5 break-all">{ticket.customer_email}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Subject</p>
              <p className="text-sm font-medium">{ticket.subject}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{ticket.description}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.1 }}>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold">Update Status</h2>
          </CardHeader>
          <CardContent>
            <Select
              options={[
                { value: "Open", label: "Open" },
                { value: "In Progress", label: "In Progress" },
                { value: "Closed", label: "Closed" },
              ]}
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.15 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Notes</h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full font-medium">
                {ticket.notes.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddNote} className="space-y-3">
              <Textarea
                placeholder="Add a note about this ticket..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={addingNote || !newNote.trim()}
                  size="sm"
                  className="min-w-[100px]"
                >
                  {addingNote ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Adding...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-3.5 w-3.5" />
                      Add Note
                    </span>
                  )}
                </Button>
              </div>
            </form>

            {ticket.notes.length === 0 ? (
              <NotesEmptyState />
            ) : (
              <div className="space-y-3 pt-2">
                <AnimatePresence>
                  {ticket.notes.map((note, i) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-xl border border-border p-4 bg-accent/30"
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.note_text}</p>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{formatDateTime(note.created_at)}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {ToastComponent}
    </div>
  );
}
