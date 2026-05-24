"use client";

import React, { useState } from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export default function Task2Submission() {
  const [githubUrl, setGithubUrl] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");
  const [sampleImagesUrl, setSampleImagesUrl] = useState("");
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

      const { error } = await supabase
        .from("submissions")
        .upsert({
          user_id: user.id,
          task_number: 2,
          github_url: githubUrl,
          deployed_url: deployedUrl,
          sample_images_url: sampleImagesUrl,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        }, { onConflict: 'user_id,task_number' });

      if (error) throw error;
      
      await supabase.from("task_statuses").upsert({
        user_id: user.id,
        task_number: 2,
        status: 'submitted',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,task_number' });

      toast.success("Task 2 submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task2)]">
          Task 2: Submission
        </h1>
        <p className="text-muted-foreground mb-8">
          Submit your dashboard code and deployment link.
        </p>

        <TaskSubNav taskNumber={2} />

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
          <p className="text-red-400 text-sm font-medium">
            <strong>CRITICAL:</strong> Keep your GitHub repository PRIVATE. Add the GitHub user <code>Kartavya28</code> as a collaborator to allow us to review your code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">GitHub Repository URL *</label>
            <input
              type="url"
              required
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task2)] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Deployed Dashboard URL *</label>
            <input
              type="url"
              required
              value={deployedUrl}
              onChange={(e) => setDeployedUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task2)] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Sample Images URL (Optional)</label>
            <p className="text-xs text-muted-foreground mb-2">Link to a drive folder or image hosting site containing screenshots of your dashboard.</p>
            <input
              type="url"
              value={sampleImagesUrl}
              onChange={(e) => setSampleImagesUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task2)] outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLocked || loadingDeadline}
            className={`w-full font-bold py-4 rounded-xl transition-opacity flex items-center justify-center gap-2 ${
              isLocked ? "bg-red-500/10 text-red-500 border border-red-500/30 cursor-not-allowed" : "bg-[var(--color-star-task2)] text-background hover:opacity-90"
            }`}
          >
            <Upload size={20} />
            {loadingDeadline ? "Checking status..." : isLocked ? "Submissions Closed" : isSubmitting ? "Submitting..." : "Submit Task 2"}
          </button>
        </form>
      </div>
    </div>
  );
}
