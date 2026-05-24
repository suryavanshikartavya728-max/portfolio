"use client";

import React, { useEffect, useState } from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import { createClient } from "@/lib/supabase/client";
import { BellRing, CalendarDays } from "lucide-react";

export default function TaskNotificationsPage({ taskNumber, accentColor }: { taskNumber: number, accentColor: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadNotifications() {
      const { data } = await supabase
        .from("task_notifications")
        .select("*")
        .or(`task_number.eq.${taskNumber},task_number.is.null`)
        .order("created_at", { ascending: false });

      setNotifications(data || []);
      setLoading(false);
    }
    loadNotifications();
  }, [taskNumber]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2" style={{ color: accentColor }}>
          Task {taskNumber}: Notifications
        </h1>
        <p className="text-muted-foreground mb-8">
          Important updates and announcements regarding this task.
        </p>

        <TaskSubNav taskNumber={taskNumber} />

        {loading ? (
          <div className="animate-pulse flex flex-col gap-4">
            <div className="h-24 bg-[var(--color-star-surface2)] rounded-xl" />
            <div className="h-24 bg-[var(--color-star-surface2)] rounded-xl" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BellRing className="mx-auto mb-4 opacity-20" size={48} />
            <p>No notifications at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl relative overflow-hidden">
                {!n.task_number && (
                  <div className="absolute top-0 right-0 bg-[var(--color-star-danger)] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-wider uppercase">
                    Global Update
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2 pr-16">
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                    n.severity === 'info' ? 'bg-blue-500/10 text-blue-400' :
                    n.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                    n.severity === 'error' ? 'bg-[var(--color-star-danger)]/10 text-[var(--color-star-danger)]' :
                    'bg-[var(--color-star-success)]/10 text-[var(--color-star-success)]'
                  }`}>
                    {n.severity?.toUpperCase() || 'INFO'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <CalendarDays size={14} />
                    {new Date(n.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap mb-3">
                  {n.message}
                </p>
                {n.link && (
                  <a href={n.link} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-star-accent)] hover:underline font-bold font-mono">
                    View Reference Link &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
