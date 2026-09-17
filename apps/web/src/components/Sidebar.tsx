import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Ticket, Plus, Headphones, Lightbulb, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tickets", label: "Tickets", icon: Ticket },
  { to: "/tickets/new", label: "New Ticket", icon: Plus },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-5">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary shadow-sm shadow-primary/20">
          <Headphones className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <span className="text-base font-semibold block leading-tight">Support CRM</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">MVP</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="rounded-xl bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] border border-primary/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-md bg-primary/10">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
            </div>
            <p className="text-xs font-semibold text-primary">Quick Tip</p>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Customers can also create tickets by emailing the support address.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-primary/80 font-medium">
            <Mail className="h-3 w-3" />
            <span>support@yourcompany.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
