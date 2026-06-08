"use client";

import React from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import { Download, Package } from "lucide-react";

export default function Task3ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task3)]">
          Task 3: Resources
        </h1>
        <p className="text-muted-foreground mb-8">
          Library documentation and datasets.
        </p>

        <TaskSubNav taskNumber={3} />

        <div className="space-y-6">
          <div className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--color-star-task3)]/10 rounded-lg shrink-0">
                <Package className="text-[var(--color-star-task3)]" size={24} />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-lg font-syne mb-2">The lunadem Library</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The Python library required for simulating lunar surface metrics.
                </p>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-sm border border-[var(--color-star-border)] mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-[var(--color-star-accent)]">$</span> 
                    <code>pip install lunadem</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl mt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--color-star-task3)]/10 rounded-lg shrink-0">
                <Package className="text-[var(--color-star-task3)]" size={24} />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-lg font-syne mb-2">Task 3 Starter Kit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download the required template folder structure containing basic training and evaluation scripts.
                </p>
                <a 
                  href="/data/task-3-star-test-2026.zip" 
                  download
                  className="inline-flex items-center gap-2 bg-[var(--color-star-task3)]/10 text-[var(--color-star-task3)] hover:bg-[var(--color-star-task3)] hover:text-background font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  <Download size={16} /> Download Starter Kit (.zip)
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 bg-background/50 border border-[var(--color-star-border)] rounded-xl mt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[var(--color-star-task3)]/10 rounded-lg shrink-0">
                <Package className="text-[var(--color-star-task3)]" size={24} />
              </div>
              <div className="w-full">
                <h3 className="font-bold text-lg font-syne mb-2">Library Documentation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The following functions are available in the <code>lunadem</code> library to help you complete your task.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg border border-[var(--color-star-border)]">
                    <h4 className="font-mono text-[var(--color-star-accent)] font-bold mb-1">get_previously_available_data()</h4>
                    <p className="text-xs text-muted-foreground">Returns a DataFrame containing the historical training data. Provides the 8 raw base features and the target label.</p>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg border border-[var(--color-star-border)]">
                    <h4 className="font-mono text-[var(--color-star-accent)] font-bold mb-1">get_current_data()</h4>
                    <p className="text-xs text-muted-foreground">Returns a live sample of 100 recent sensor readings. Provides only the 8 raw base features. Note: This live stream updates once per hour.</p>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg border border-[var(--color-star-border)]">
                    <h4 className="font-mono text-[var(--color-star-accent)] font-bold mb-2">Feature Extractors</h4>
                    <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                      <li><code>extract_mineral_index(features)</code></li>
                      <li><code>calculate_thermal_inertia(features)</code></li>
                      <li><code>compute_albedo_ratio(features)</code></li>
                      <li><code>estimate_regolith_depth(features)</code></li>
                    </ul>
                  </div>

                  <div className="bg-black/30 p-4 rounded-lg border border-[var(--color-star-border)]">
                    <h4 className="font-mono text-[var(--color-star-accent)] font-bold mb-1">predict_label(features)</h4>
                    <p className="text-xs text-muted-foreground">Submit a complete row (8 raw + 4 extracted features) to validate your model against our internal reference engine. Returns the true label, or throws an error if input is malformed/unknown.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
