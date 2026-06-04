"use client";

import React from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import { Download } from "lucide-react";

export default function Task4ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-orange-500">
          Task 4: Resources
        </h1>
        <p className="text-muted-foreground mb-8">
          Reference materials for your Hardware Systems Development task.
        </p>

        <TaskSubNav taskNumber={4} />

        <div className="space-y-6">
          <div className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg shrink-0">
                <Download className="text-orange-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg font-syne mb-2">CanSat PDR Example</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Download a previous Preliminary Design Review (PDR) document for reference. 
                  <br />
                  <span className="font-medium text-foreground">Note:</span> Pages 35 through 43, as well as pages 116 through 125 of this document, serve as an excellent reference for the expected standard and format of your deliverables.
                </p>
                <a 
                  href="/Cansat_2023_1072_PDR.pdf" 
                  download
                  className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-background font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <Download size={16} /> Download PDR Document (PDF)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
