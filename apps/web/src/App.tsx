import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { TicketList } from "@/pages/TicketList";
import { TicketDetail } from "@/pages/TicketDetail";
import { CreateTicket } from "@/pages/CreateTicket";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/new" element={<CreateTicket />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
