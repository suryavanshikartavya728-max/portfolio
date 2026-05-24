"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Download, Upload, Bell } from "lucide-react";

interface TaskSubNavProps {
  taskNumber: number;
}

export default function TaskSubNav({ taskNumber }: TaskSubNavProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/task-${taskNumber}`;

  const tabs = [
    { href: basePath, label: "Problem Statement", icon: FileText, exact: true },
    { href: `${basePath}/resources`, label: "Resources", icon: Download, exact: false },
    { href: `${basePath}/submission`, label: "Submission", icon: Upload, exact: false },
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
