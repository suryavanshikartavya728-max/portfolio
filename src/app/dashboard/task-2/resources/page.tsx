"use client";

import React from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import { Download, ExternalLink } from "lucide-react";

export default function Task2ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task2)]">
          Task 2: Resources
        </h1>
        <p className="text-muted-foreground mb-8">
          Datasets and references for building your dashboard.
        </p>

        <TaskSubNav taskNumber={2} />

        <div className="space-y-6">
          <div className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--color-star-task2)]/10 rounded-lg shrink-0">
                <DatabaseIcon className="text-[var(--color-star-task2)]" size={24} />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-lg font-syne mb-2">Dataset Link</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The primary dataset is derived from the Chandrayaan-2 CLASS payload.
                </p>
                <a 
                  href="https://pradan.issdc.gov.in/ch2/" 
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[var(--color-star-task2)]/10 text-[var(--color-star-task2)] hover:bg-[var(--color-star-task2)] hover:text-background font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <ExternalLink size={16} /> Open PRADAN Portal
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--color-star-task2)]/10 rounded-lg shrink-0">
                <Download className="text-[var(--color-star-task2)]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-syne mb-2">Inter IIT Problem Statement</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download the official Inter IIT Tech Meet 13.0 problem statement for reference.
                </p>
                <a 
                  href="/2024_HighPrep_ISRO.pdf" 
                  download
                  className="inline-flex items-center gap-2 bg-[var(--color-star-task2)]/10 text-[var(--color-star-task2)] hover:bg-[var(--color-star-task2)] hover:text-background font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <Download size={16} /> Download Problem Statement (PDF)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
