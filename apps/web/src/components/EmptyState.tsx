import { motion } from "framer-motion";
import {
  EmptyTicketsIllustration,
  SearchEmptyIllustration,
  WelcomeIllustration,
  NotesEmptyIllustration,
  ErrorIllustration,
  NotFoundIllustration,
  SuccessIllustration,
  OfflineIllustration,
} from "./Illustrations";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  illustration: keyof typeof illustrations;
}

const illustrations = {
  tickets: EmptyTicketsIllustration,
  search: SearchEmptyIllustration,
  welcome: WelcomeIllustration,
  notes: NotesEmptyIllustration,
  error: ErrorIllustration,
  notFound: NotFoundIllustration,
  success: SuccessIllustration,
  offline: OfflineIllustration,
  loading: EmptyTicketsIllustration,
};

export function EmptyState({ title, description, action, illustration }: EmptyStateProps) {
  const IllustrationComponent = illustrations[illustration];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-80 h-64 mb-8"
      >
        <IllustrationComponent />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-xl font-semibold mb-2"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed"
      >
        {description}
      </motion.p>
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}

export function TicketEmptyState({ action }: { action?: React.ReactNode }) {
  return (
    <EmptyState
      illustration="tickets"
      title="No tickets yet"
      description="Create your first support ticket to get started. You can create tickets manually or have them auto-generated from support emails."
      action={action}
    />
  );
}

export function SearchEmptyState() {
  return (
    <EmptyState
      illustration="search"
      title="No results found"
      description="Try adjusting your search or filter to find what you're looking for."
    />
  );
}

export function DashboardEmptyState({ action }: { action?: React.ReactNode }) {
  return (
    <EmptyState
      illustration="welcome"
      title="Welcome to Support CRM"
      description="Your support dashboard is empty. Create a ticket to start managing customer requests."
      action={action}
    />
  );
}

export function NotesEmptyState() {
  return (
    <EmptyState
      illustration="notes"
      title="No notes yet"
      description="Add a note to keep track of updates and communication for this ticket."
    />
  );
}

export function TicketNotFoundState({ action }: { action?: React.ReactNode }) {
  return (
    <EmptyState
      illustration="notFound"
      title="Ticket not found"
      description="The ticket you're looking for doesn't exist or has been removed."
      action={action}
    />
  );
}

