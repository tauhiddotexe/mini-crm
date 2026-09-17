import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Ticket, Clock, CheckCircle, AlertCircle, ArrowRight, Activity } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { StatusBadge } from "@/components/StatusBadge";
import { DashboardEmptyState } from "@/components/EmptyState";
import { DashboardSkeleton } from "@/components/Skeleton";

import TeamWorkSvg from "@/assets/illustrations/team-work.svg?react";
import InboxSvg from "@/assets/illustrations/inbox.svg?react";
import WorkInProgressSvg from "@/assets/illustrations/work-in-progress.svg?react";
import DoneSvg from "@/assets/illustrations/done.svg?react";

import type { TicketListItem } from "@/types/ticket";

const STATUS_COLORS = {
  Open: "hsl(168, 76%, 42%)",
  "In Progress": "hsl(38, 92%, 50%)",
  Closed: "hsl(0, 84%, 60%)",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
};

interface KpiConfig {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  illustration: React.ComponentType<{ className?: string }>;
  accent: string;
  iconColor: string;
}

function KpiCard({ label, value, icon: Icon, illustration: Illustration, accent, iconColor }: KpiConfig) {
  return (
    <motion.div variants={item}>
      <div
        className="relative rounded-2xl overflow-hidden min-h-[140px] border border-black/[0.04] shadow-sm hover:shadow-lg hover:shadow-black/[0.06] transition-all duration-300 bg-white group"
      >
        {/* Subtle accent gradient in top-left */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, ${accent}, transparent 70%)`,
          }}
        />

        {/* Illustration — positioned bottom-right, cropped, multiply blend so white bg vanishes */}
        <div className="absolute -bottom-6 -right-4 w-[140px] h-[140px] pointer-events-none select-none mix-blend-multiply opacity-40 group-hover:opacity-60 transition-opacity duration-500">
          <Illustration className="w-full h-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-5 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">{label}</p>
            <p className="text-[2rem] font-extrabold mt-1 tabular-nums tracking-tight leading-none">{value}</p>
          </div>
          <div
            className="p-2.5 rounded-xl shadow-sm border border-black/[0.06]"
            style={{ background: `${accent}15` }}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listTickets().then(setTickets).finally(() => setLoading(false));
  }, []);

  const counts = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    inProgress: tickets.filter((t) => t.status === "In Progress").length,
    closed: tickets.filter((t) => t.status === "Closed").length,
  };

  const pieData = [
    { name: "Open", value: counts.open },
    { name: "In Progress", value: counts.inProgress },
    { name: "Closed", value: counts.closed },
  ].filter((d) => d.value > 0);

  const recentTickets = tickets.slice(0, 6);

  if (loading) return <DashboardSkeleton />;

  if (tickets.length === 0) {
    return (
      <div className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold tracking-tight"
        >
          Dashboard
        </motion.h1>
        <DashboardEmptyState
          action={
            <Link to="/tickets/new">
              <Button size="lg">
                <Ticket className="h-4 w-4 mr-2" />
                Create Your First Ticket
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-2"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Overview of your support tickets</p>
        </div>
        <Link to="/tickets">
          <Button variant="ghost" size="sm" className="gap-1 sm:gap-1.5 text-xs sm:text-sm px-2 sm:px-3">
            View all
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Button>
        </Link>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <KpiCard label="Total Tickets" value={counts.total} icon={Ticket} illustration={TeamWorkSvg} accent="#21B6A8" iconColor="text-teal-600" />
        <KpiCard label="Open" value={counts.open} icon={AlertCircle} illustration={InboxSvg} accent="#3B82F6" iconColor="text-blue-600" />
        <KpiCard label="In Progress" value={counts.inProgress} icon={Clock} illustration={WorkInProgressSvg} accent="#F59E0B" iconColor="text-amber-600" />
        <KpiCard label="Closed" value={counts.closed} icon={CheckCircle} illustration={DoneSvg} accent="#EF4444" iconColor="text-red-500" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Recent Tickets</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Latest support requests</p>
              </div>
              <Link to="/tickets" className="text-xs text-primary hover:underline font-medium">
                View all
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentTickets.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                  No tickets yet
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recentTickets.map((ticket, i) => (
                    <motion.div
                      key={ticket.ticket_id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.04 }}
                    >
                      <Link
                        to={`/tickets/${ticket.ticket_id}`}
                        className="flex items-center justify-between px-6 py-3.5 hover:bg-accent/50 transition-colors duration-150 group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded shrink-0">
                            {ticket.ticket_id}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {ticket.customer_name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate sm:hidden">{ticket.subject}</p>
                          </div>
                          <span className="text-sm text-muted-foreground hidden sm:inline truncate">- {ticket.subject}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <StatusBadge status={ticket.status} />
                          <span className="text-xs text-muted-foreground">{formatDate(ticket.created_at)}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold">Status Distribution</h2>
              </CardHeader>
              <CardContent>
                {pieData.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    No data yet
                  </div>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {pieData.map((entry) => (
                            <Cell key={entry.name} fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            fontSize: "12px",
                            padding: "8px 12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-5 mt-4">
                      {Object.entries(STATUS_COLORS).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-2 text-xs">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className="text-muted-foreground">{name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h2 className="text-base font-semibold">Quick Stats</h2>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resolution Rate</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-all duration-500"
                        style={{ width: `${counts.total > 0 ? (counts.closed / counts.total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium tabular-nums">
                      {counts.total > 0 ? Math.round((counts.closed / counts.total) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Response</span>
                  <span className="text-sm font-medium">~2h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Now</span>
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                    </span>
                    <span className="text-sm font-medium">{counts.open + counts.inProgress}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
