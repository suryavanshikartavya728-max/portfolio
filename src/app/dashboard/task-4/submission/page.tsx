"use client";

import React, { useState } from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, AlertTriangle } from "lucide-react";

export default function Task4Submission() {
  const [driveUrl, setDriveUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [loadingDeadline, setLoadingDeadline] = useState(true);

  const supabase = createClient();
  const router = useRouter();

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

      const { error: subError } = await supabase
        .from("submissions")
        .upsert({
          user_id: user.id,
          task_number: 4,
          github_url: driveUrl,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        }, { onConflict: 'user_id,task_number' });

      if (subError) throw subError;
      
      await supabase.from("task_statuses").upsert({
        user_id: user.id,
        task_number: 4,
        status: 'submitted',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,task_number' });

      toast.success("Task 4 submitted successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-orange-500">
          Task 4: Submission
        </h1>
        <p className="text-muted-foreground mb-8">
          Submit your CanSat Project deliverables.
        </p>

        <TaskSubNav taskNumber={4} />

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 flex gap-3">
          <AlertTriangle className="text-yellow-500 shrink-0" />
          <p className="text-yellow-500 text-sm font-medium">
            <strong>IMPORTANT:</strong> Ensure your Google Drive link permissions are set to "Anyone with the link can view". If we cannot access your files, your submission will not be evaluated.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Google Drive Link *</label>
            <input
              type="url"
              required
              placeholder="https://drive.google.com/..."
              value={driveUrl}
              onChange={(e) => setDriveUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-orange-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLocked || loadingDeadline}
            className={`w-full font-bold py-4 rounded-xl transition-opacity flex items-center justify-center gap-2 mt-4 ${
              isLocked ? "bg-red-500/10 text-red-500 border border-red-500/30 cursor-not-allowed" : "bg-orange-500 text-background hover:opacity-90"
            }`}
          >
            <Upload size={20} />
            {loadingDeadline ? "Checking status..." : isLocked ? "Submissions Closed" : isSubmitting ? "Submitting..." : "Submit Task 4"}
          </button>
        </form>
      </div>
    </div>
  );
}
