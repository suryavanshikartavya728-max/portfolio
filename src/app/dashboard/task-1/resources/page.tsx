"use client";

import React from "react";
import Link from "next/link";
import { Download, Terminal, Code2 } from "lucide-react";

export default function Task1ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task1)]">
          Task 1: Resources & Instructions
        </h1>
        <p className="text-muted-foreground mb-8">
          Download the codebase and follow the setup instructions to begin your assessment.
        </p>

        <div className="space-y-6">
          <div className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--color-star-task1)]/10 rounded-lg shrink-0">
                <Download className="text-[var(--color-star-task1)]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-syne mb-2">1. Download Payload</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The zip file below contains the clean Next.js frontend codebase for the STAC website. Node modules and Git history have been removed.
                </p>
                <a 
                  href="/STAC-IIT-Mandi-Task1.zip" 
                  download
                  className="inline-flex items-center gap-2 bg-[var(--color-star-task1)]/10 text-[var(--color-star-task1)] hover:bg-[var(--color-star-task1)] hover:text-background font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <Download size={16} /> Download STAC-IIT-Mandi.zip
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--color-star-task1)]/10 rounded-lg shrink-0">
                <Terminal className="text-[var(--color-star-task1)]" size={24} />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-lg font-syne mb-2">2. Local Setup</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Extract the zip file, navigate to the frontend folder, install dependencies, and start the development server.
                </p>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm border border-[var(--color-star-border)]">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <span className="text-[var(--color-star-accent)]">$</span> 
                    <code>cd STAC-IIT-Mandi/frontend</code>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <span className="text-[var(--color-star-accent)]">$</span> 
                    <code>npm install</code>
                    <span className="text-xs ml-2 opacity-50"># Installs node_modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <span className="text-[var(--color-star-accent)]">$</span> 
                    <code>npm run dev</code>
                    <span className="text-xs ml-2 opacity-50"># Starts the local server</span>
                  </div>
                  <div className="border-t border-[var(--color-star-border)] pt-4 mt-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-[var(--color-star-accent)]">$</span> 
                      <code>npm run build</code>
                      <span className="text-xs ml-2 opacity-50"># Run this to verify your build passes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--color-star-task1)]/10 rounded-lg shrink-0">
                <Code2 className="text-[var(--color-star-task1)]" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-syne mb-2">3. Begin Development</h3>
                <p className="text-sm text-muted-foreground">
                  You are required to build a full-stack inventory management system. Read the <Link href="/dashboard/task-1" className="text-[var(--color-star-task1)] hover:underline">Problem Statement</Link> for detailed requirements. Note that <code>/login</code> and <code>/manage-inventory</code> stubs have already been created for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
