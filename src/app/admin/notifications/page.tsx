"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Send, Trash2, BellRing } from "lucide-react";

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [taskNumber, setTaskNumber] = useState<string>("global");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const { data } = await supabase
      .from("task_notifications")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setNotifications(data);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const task_number = taskNumber === "global" ? null : parseInt(taskNumber);

    const { error } = await supabase.from("task_notifications").insert({
      task_number,
      message,
      severity,
      link: link || null
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Notification broadcasted successfully");
      setMessage("");
      setLink("");
      loadNotifications();
    }
    setIsSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this notification?")) return;
    
    const { error } = await supabase.from("task_notifications").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Deleted successfully");
      loadNotifications();
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-syne mb-2 text-foreground">Notifications</h1>
        <p className="text-muted-foreground font-mono text-sm">Broadcast messages to students</p>
      </div>

      <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-lg font-bold font-syne mb-6 flex items-center gap-2">
          <BellRing size={20} className="text-red-400" />
          Create Broadcast
        </h2>
        
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Target Audience</label>
              <select 
                value={taskNumber}
                onChange={(e) => setTaskNumber(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black/60 border border-red-500/20 text-foreground outline-none focus:border-red-500/50"
              >
                <option value="global">Global (All Users)</option>
                <option value="1">Task 1 Only</option>
                <option value="2">Task 2 Only</option>
                <option value="3">Task 3 Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Severity</label>
              <select 
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black/60 border border-red-500/20 text-foreground outline-none focus:border-red-500/50"
              >
                <option value="info">Info (Blue)</option>
                <option value="warning">Warning (Yellow)</option>
                <option value="success">Success (Green)</option>
                <option value="error">Critical (Red)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
            <textarea 
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your announcement here..."
              className="w-full px-4 py-2 rounded-lg bg-black/60 border border-red-500/20 text-foreground outline-none focus:border-red-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Optional Link (URL)</label>
            <input 
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-lg bg-black/60 border border-red-500/20 text-foreground outline-none focus:border-red-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            <Send size={18} />
            {isSubmitting ? "Broadcasting..." : "Broadcast Notification"}
          </button>
        </form>
      </div>

      <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-lg font-bold font-syne mb-6">Active Notifications</h2>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-white/5 rounded-lg" />
            <div className="h-16 bg-white/5 rounded-lg" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No active notifications</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="flex items-center justify-between p-4 bg-black/60 border border-white/5 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      n.severity === 'info' ? 'bg-blue-500/10 text-blue-400' :
                      n.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                      n.severity === 'error' ? 'bg-red-500/10 text-red-400' :
                      'bg-green-500/10 text-green-400'
                    }`}>
                      {n.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {n.task_number ? `Task ${n.task_number}` : 'Global'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{n.message}</p>
                </div>
                <button 
                  onClick={() => handleDelete(n.id)}
                  className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
