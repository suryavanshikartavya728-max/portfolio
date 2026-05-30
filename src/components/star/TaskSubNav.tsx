"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Download, Upload, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface TaskSubNavProps {
  taskNumber: number;
}

export default function TaskSubNav({ taskNumber }: TaskSubNavProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/task-${taskNumber}`;
  const supabase = createClient();

  const [isOpen, setIsOpen] = useState(true);
  const [phase, setPhase] = useState("submission");
  const [isDisqualified, setIsDisqualified] = useState(false);

  useEffect(() => {
    async function loadNavStatus() {
      // 1. Fetch site settings (phase)
      const { data: settings } = await supabase.from("site_settings").select("phase").eq("id", 1).single();
      if (settings?.phase) setPhase(settings.phase);

      // 2. Fetch specific task is_open
      const { data: task } = await supabase.from("tasks").select("is_open").eq("task_number", taskNumber).single();
      if (task) setIsOpen(!!task.is_open);

      // 3. Fetch user disqualification
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("is_disqualified").eq("id", user.id).single();
        if (profile) setIsDisqualified(!!profile.is_disqualified);
      }
    }
    loadNavStatus();
  }, [taskNumber]);

  const showSubmission = isOpen && (phase === "submission") && !isDisqualified;

  const tabs = [
    { href: basePath, label: "Problem Statement", icon: FileText, exact: true },
    { href: `${basePath}/resources`, label: "Resources", icon: Download, exact: false },
    ...(showSubmission ? [{ href: `${basePath}/submission`, label: "Submission", icon: Upload, exact: false }] : []),
    ...(taskNumber === 3 ? [{ href: `${basePath}/leaderboard`, label: "Leaderboard", icon: FileText, exact: false }] : []),
    { href: `${basePath}/notifications`, label: "Notifications", icon: Bell, exact: false },
  ];

  return (
    <div className="flex overflow-x-auto scrollbar-hidden border-b border-[var(--color-star-border)] mb-6">
      <div className="flex gap-1 md:gap-2 pb-px">
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "border-[var(--color-star-accent)] text-[var(--color-star-accent)]"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-[var(--color-star-border)]"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
