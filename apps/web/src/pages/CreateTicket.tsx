import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, User, FileText, Send, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Input, Textarea } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card, CardHeader, CardContent } from "@/components/Card";
import { useToast } from "@/components/Toast";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
};

export function CreateTicket() {
  const navigate = useNavigate();
  const { show, ToastComponent } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.customer_name.trim()) errs.customer_name = "Name is required";
    if (!form.customer_email.trim()) errs.customer_email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) errs.customer_email = "Enter a valid email address";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    else if (form.subject.length > 250) errs.subject = "Subject must be under 250 characters";
    if (!form.description.trim()) errs.description = "Description is required";
    else if (form.description.length < 10) errs.description = "Please provide more detail (at least 10 characters)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleBlur(field: string) {
    setTouched({ ...touched, [field]: true });
    validate();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ customer_name: true, customer_email: true, subject: true, description: true });
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await api.createTicket(form);
      show(`Ticket ${result.ticket_id} created successfully`);
      setTimeout(() => navigate("/tickets"), 800);
    } catch {
      show("Failed to create ticket. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div {...fadeIn} className="flex items-center gap-3">
        <button
          onClick={() => navigate("/tickets")}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Ticket</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to create a new support ticket</p>
        </div>
      </motion.div>

      <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.05 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-base font-semibold">Customer Information</h2>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Customer Name
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    onBlur={() => handleBlur("customer_name")}
                    error={touched.customer_name ? errors.customer_name : undefined}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Customer Email
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={form.customer_email}
                    onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
                    onBlur={() => handleBlur("customer_email")}
                    error={touched.customer_email ? errors.customer_email : undefined}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Subject
                </label>
                <Input
                  placeholder="Brief description of the issue"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  onBlur={() => handleBlur("subject")}
                  error={touched.subject ? errors.subject : undefined}
                  hint={touched.subject && !errors.subject && form.subject ? `${form.subject.length}/250 characters` : undefined}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Description
                </label>
                <Textarea
                  placeholder="Provide a detailed description of the support request..."
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  onBlur={() => handleBlur("description")}
                  error={touched.description ? errors.description : undefined}
                  hint={touched.description && !errors.description && form.description ? `${form.description.length} characters` : undefined}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="min-w-[140px]">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Create Ticket
                    </span>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/tickets")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {ToastComponent}
    </div>
  );
}
