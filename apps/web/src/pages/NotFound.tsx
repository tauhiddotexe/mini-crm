import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/Button";
import { NotFoundIllustration } from "@/components/Illustrations";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-96 h-72 mb-8"
      >
        <NotFoundIllustration />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-bold tracking-tight mb-3"
      >
        404
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed"
      >
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3"
      >
        <Link to="/">
          <Button>
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Button>
        </Link>
        <Link to="/tickets">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            View Tickets
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
