import { motion } from "framer-motion";

import HappyCustomer from "@/assets/illustrations/happy-customer.svg?react";
import Inbox from "@/assets/illustrations/inbox.svg?react";
import WorkInProgress from "@/assets/illustrations/work-in-progress.svg?react";
import NotFound from "@/assets/illustrations/not-found.svg?react";
import ConnectionLost from "@/assets/illustrations/connection-lost.svg?react";
import Done from "@/assets/illustrations/done.svg?react";
import TeamWork from "@/assets/illustrations/team-work.svg?react";
import Search from "@/assets/illustrations/search.svg?react";

export function LoadingIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center mix-blend-multiply">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      >
        <WorkInProgress />
      </motion.div>
    </div>
  );
}

export function EmptyTicketsIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center mix-blend-multiply">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      >
        <Inbox />
      </motion.div>
    </div>
  );
}

export function SearchEmptyIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center mix-blend-multiply">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      >
        <Search />
      </motion.div>
    </div>
  );
}

export function WelcomeIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center mix-blend-multiply">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      >
        <HappyCustomer />
      </motion.div>
    </div>
  );
}

export function NotesEmptyIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center mix-blend-multiply">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      >
        <TeamWork />
      </motion.div>
    </div>
  );
}

export function ErrorIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center mix-blend-multiply">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      >
        <ConnectionLost />
      </motion.div>
    </div>
  );
}

export function NotFoundIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center mix-blend-multiply">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      >
        <NotFound />
      </motion.div>
    </div>
  );
}

export function SuccessIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center mix-blend-multiply">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      >
        <Done />
      </motion.div>
    </div>
  );
}

export function OfflineIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center mix-blend-multiply">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
      >
        <ConnectionLost />
      </motion.div>
    </div>
  );
}


