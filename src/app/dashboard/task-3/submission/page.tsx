"use client";

import React, { useState } from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Upload, AlertTriangle } from "lucide-react";

export default function Task3Submission() {
  const [githubUrl, setGithubUrl] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [f1, setF1] = useState("");
  const [precision, setPrecision] = useState("");
  const [recall, setRecall] = useState("");
  const [rocAuc, setRocAuc] = useState("");
  const [customMetricName, setCustomMetricName] = useState("");
  const [customMetricValue, setCustomMetricValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [loadingDeadline, setLoadingDeadline] = useState(true);

  const supabase = createClient();

  React.useEffect(() => {
    async function checkLock() {
      const { data } = await supabase.from("site_settings").select("deadline").eq("id", 1).single();
      if (data?.deadline) {
        setIsLocked(new Date() > new Date(data.deadline));
      }
      setLoadingDeadline(false);
    }
    checkLock();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return toast.error("Submissions are locked.");
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const parsedAccuracy = parseFloat(accuracy) || 0;
      const parsedF1 = parseFloat(f1) || 0;
      const parsedPrecision = parseFloat(precision) || 0;
      const parsedRecall = parseFloat(recall) || 0;
      const parsedRocAuc = parseFloat(rocAuc) || 0;
      const parsedCustomValue = parseFloat(customMetricValue) || 0;

      // Calculate overall score: 40*accuracy + 30*ROC + 10*recall + 10*F1 + 10*precision
      const overallScore = (40 * parsedAccuracy) + (30 * parsedRocAuc) + (10 * parsedRecall) + (10 * parsedF1) + (10 * parsedPrecision);

      const { error: subError } = await supabase
        .from("submissions")
        .upsert({
          user_id: user.id,
          task_number: 3,
          github_url: githubUrl,
          accuracy: parsedAccuracy,
          f1_score: parsedF1,
          precision_score: parsedPrecision,
          recall: parsedRecall,
          roc_auc: parsedRocAuc,
          custom_metric_name: customMetricName,
          custom_metric_value: parsedCustomValue,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        }, { onConflict: 'user_id,task_number' });

      if (subError) throw subError;
      
      await supabase.from("task_statuses").upsert({
        user_id: user.id,
        task_number: 3,
        status: 'submitted',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,task_number' });

      // Add to leaderboard
      await supabase.from("leaderboard").upsert({
        user_id: user.id,
        overall_score: overallScore,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      toast.success("Task 3 submitted and leaderboard updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task3)]">
          Task 3: Submission
        </h1>
        <p className="text-muted-foreground mb-8">
          Submit your metrics and repository link.
        </p>

        <TaskSubNav taskNumber={3} />

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 flex gap-3">
          <AlertTriangle className="text-red-400 shrink-0" />
          <p className="text-red-400 text-sm font-medium">
            <strong>WARNING:</strong> These metrics will instantly populate the public leaderboard. Submitting false, exaggerated, or mathematically impossible metrics will result in disqualification after manual review.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">GitHub Repository URL *</label>
            <input
              type="url"
              required
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task3)] outline-none transition-colors"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-syne border-b border-[var(--color-star-border)] pb-2">Evaluation Metrics</h3>
            <p className="text-sm text-muted-foreground">Format as decimals between 0.00 and 1.00 (e.g., 0.95 for 95%)</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Accuracy *</label>
                <input type="number" step="0.001" min="0" max="1" required value={accuracy} onChange={(e)=>setAccuracy(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task3)] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">F1 Score *</label>
                <input type="number" step="0.001" min="0" max="1" required value={f1} onChange={(e)=>setF1(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task3)] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Precision *</label>
                <input type="number" step="0.001" min="0" max="1" required value={precision} onChange={(e)=>setPrecision(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task3)] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Recall *</label>
                <input type="number" step="0.001" min="0" max="1" required value={recall} onChange={(e)=>setRecall(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task3)] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">ROC-AUC *</label>
                <input type="number" step="0.001" min="0" max="1" required value={rocAuc} onChange={(e)=>setRocAuc(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task3)] outline-none" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Custom Metric Name (Optional)</label>
                <input type="text" placeholder="e.g. Log Loss" value={customMetricName} onChange={(e)=>setCustomMetricName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task3)] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Custom Metric Value (Optional)</label>
                <input type="number" step="0.001" value={customMetricValue} onChange={(e)=>setCustomMetricValue(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task3)] outline-none" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLocked || loadingDeadline}
            className={`w-full font-bold py-4 rounded-xl transition-opacity flex items-center justify-center gap-2 mt-4 ${
              isLocked ? "bg-red-500/10 text-red-500 border border-red-500/30 cursor-not-allowed" : "bg-[var(--color-star-task3)] text-background hover:opacity-90"
            }`}
          >
            <Upload size={20} />
            {loadingDeadline ? "Checking status..." : isLocked ? "Submissions Closed" : isSubmitting ? "Submitting..." : "Submit Task 3 Metrics"}
          </button>
        </form>
      </div>
    </div>
  );
}
