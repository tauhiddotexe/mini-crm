import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, X } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { TicketEmptyState, SearchEmptyState } from "@/components/EmptyState";
import { TableRowSkeleton } from "@/components/Skeleton";
import type { TicketListItem } from "@/types/ticket";

const STATUS_TABS = ["All", "Open", "In Progress", "Closed"] as const;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

export function TicketList() {
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params: { status?: string; search?: string } = {};
    if (activeTab !== "All") params.status = activeTab;
    if (debouncedSearch) params.search = debouncedSearch;

    setLoading(true);
    api.listTickets(params).then(setTickets).finally(() => setLoading(false));
  }, [activeTab, debouncedSearch]);

  const hasFilters = debouncedSearch || activeTab !== "All";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} total
          </p>
        </div>
        <Link to="/tickets/new">
          <Button>
            <Plus className="h-4 w-4 mr-1.5" />
            New Ticket
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex gap-1 rounded-lg bg-muted p-1 max-w-full overflow-x-auto scrollbar-none shrink-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-all duration-150 ${
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {[...Array(5)].map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        </Card>
      ) : tickets.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {hasFilters ? (
            <SearchEmptyState />
          ) : (
            <TicketEmptyState
              action={
                <Link to="/tickets/new">
                  <Button>Create your first ticket</Button>
                </Link>
              }
            />
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Subject</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Created</th>
                  </tr>
                </thead>
                <motion.tbody variants={container} initial="hidden" animate="show">
                  {tickets.map((ticket) => (
                    <motion.tr
                      key={ticket.ticket_id}
                      variants={item}
                      className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors duration-150"
                    >
                      <td className="py-3.5 px-3 sm:px-4">
                        <Link
                          to={`/tickets/${ticket.ticket_id}`}
                          className="font-mono text-xs sm:text-sm text-primary hover:underline font-medium"
                        >
                          {ticket.ticket_id}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 min-w-[120px]">
                        <span className="text-xs sm:text-sm font-medium block">{ticket.customer_name}</span>
                        <span className="text-[11px] text-muted-foreground truncate max-w-[160px] block sm:hidden mt-0.5">{ticket.subject}</span>
                      </td>
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">{ticket.subject}</span>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="py-3.5 px-4 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">{formatDate(ticket.created_at)}</span>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
