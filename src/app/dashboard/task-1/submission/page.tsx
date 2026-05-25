"use client";

import React, { useState } from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export default function Task1Submission() {
  const [githubUrl, setGithubUrl] = useState("");
  const [deployedUrl, setDeployedUrl] = useState("");
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [coreUser, setCoreUser] = useState("");
  const [corePass, setCorePass] = useState("");
  const [volUser, setVolUser] = useState("");
  const [volPass, setVolPass] = useState("");
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
          task_number: 1,
          github_url: githubUrl,
          deployed_url: deployedUrl,
          admin_username: adminUser,
          admin_password: adminPass,
          core_member_username: coreUser,
          core_member_password: corePass,
          volunteer_username: volUser,
          volunteer_password: volPass,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        }, { onConflict: 'user_id,task_number' });

      if (error) throw error;
      
      // Update task status
      await supabase.from("task_statuses").upsert({
        user_id: user.id,
        task_number: 1,
        status: 'submitted',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,task_number' });

      toast.success("Task 1 submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task1)]">
          Task 1: Submission
        </h1>
        <p className="text-muted-foreground mb-8">
          Submit your codebase and deployment links for evaluation.
        </p>

        <TaskSubNav taskNumber={1} />

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
          <p className="text-red-400 text-sm font-medium">
            <strong>CRITICAL:</strong> Keep your GitHub repository PRIVATE. Add the GitHub users <code>Kartavya728</code> and <code>STAC-IITMandi</code> as collaborators to allow us to review your code. Public repositories will lead to immediate disqualification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-syne border-b border-[var(--color-star-border)] pb-2">Links</h3>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">GitHub Repository URL *</label>
              <input
                type="url"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/stac-inventory"
                className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task1)] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Deployed Application URL *</label>
              <input
                type="url"
                required
                value={deployedUrl}
                onChange={(e) => setDeployedUrl(e.target.value)}
                placeholder="https://my-inventory.vercel.app"
                className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-task1)] outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-syne border-b border-[var(--color-star-border)] pb-2">Test Credentials</h3>
            <p className="text-sm text-muted-foreground">Provide dummy credentials so we can test the role-based access control.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-[var(--color-star-border)] rounded-xl bg-background/50">
                <h4 className="font-bold mb-3">Admin</h4>
                <input type="text" placeholder="Username" value={adminUser} onChange={(e)=>setAdminUser(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] outline-none" required />
                <input type="text" placeholder="Password" value={adminPass} onChange={(e)=>setAdminPass(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] outline-none" required />
              </div>
              <div className="p-4 border border-[var(--color-star-border)] rounded-xl bg-background/50">
                <h4 className="font-bold mb-3">Core Member</h4>
                <input type="text" placeholder="Username" value={coreUser} onChange={(e)=>setCoreUser(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] outline-none" required />
                <input type="text" placeholder="Password" value={corePass} onChange={(e)=>setCorePass(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] outline-none" required />
              </div>
              <div className="p-4 border border-[var(--color-star-border)] rounded-xl bg-background/50">
                <h4 className="font-bold mb-3">Volunteer</h4>
                <input type="text" placeholder="Username" value={volUser} onChange={(e)=>setVolUser(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] outline-none" required />
                <input type="text" placeholder="Password" value={volPass} onChange={(e)=>setVolPass(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-background border border-[var(--color-star-border)] outline-none" required />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLocked || loadingDeadline}
            className={`w-full font-bold py-4 rounded-xl transition-opacity flex items-center justify-center gap-2 ${
              isLocked ? "bg-red-500/10 text-red-500 border border-red-500/30 cursor-not-allowed" : "bg-[var(--color-star-task1)] text-background hover:opacity-90"
            }`}
          >
            <Upload size={20} />
            {loadingDeadline ? "Checking status..." : isLocked ? "Submissions Closed" : isSubmitting ? "Submitting..." : "Submit Task 1"}
          </button>
        </form>
      </div>
    </div>
  );
}
