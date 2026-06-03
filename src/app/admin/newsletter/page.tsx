"use client";

import { useState, useEffect, useCallback } from "react";
import { Send, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { listDocs } from "@/lib/admin-api";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchSubs = useCallback(async () => {
    try {
      const data = await listDocs("newsletterSubscribers", { field: "subscribed_at", direction: "desc" });
      setSubscribers(data);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) { toast.error("Subject and message are required"); return; }
    if (subscribers.length === 0) { toast.error("No subscribers yet"); return; }
    if (!confirm("Send this newsletter to " + subscribers.length + " subscriber(s)?")) return;

    setSending(true);
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Newsletter sent to " + (data.sent || subscribers.length) + " subscriber(s)");
        setSubject(""); setBody("");
      } else {
        toast.error(data.error || "Failed to send");
      }
    } catch (err: any) { toast.error("Failed to send newsletter"); }
    setSending(false);
  };

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy">Send Newsletter</h1>
        <p className="text-sm text-gray-500">{subscribers.length} subscriber(s)</p>
      </div>

      <div className="admin-card space-y-5 mb-6">
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Subject <span className="text-red-400">*</span></label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="input-field" placeholder="New Insight: The Future of Impact Investing" />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Message <span className="text-red-400">*</span></label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} className="input-field" rows={8} placeholder="Write your newsletter content here..." />
          <p className="text-xs text-gray-400 mt-1">Plain text. Links will be clickable.</p>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
          <Button onClick={handleSend} loading={sending}><Send size={16} /> Send to {subscribers.length} Subscriber(s)</Button>
        </div>
      </div>

      <div className="admin-card">
        <h2 className="font-display text-base font-semibold text-navy mb-4">Subscribers</h2>
        {subscribers.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No subscribers yet.</p>
        ) : (
          <div className="space-y-2">
            {subscribers.map((sub: any) => (
              <div key={sub.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
                <Mail size={14} className="text-gray-400" />
                <span className="text-sm text-navy">{sub.email}</span>
                <span className="text-[10px] text-gray-300 ml-auto">{sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString() : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
