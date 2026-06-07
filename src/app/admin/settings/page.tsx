"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Save, Clock, ShieldAlert, Sliders, Layers, Eye, EyeOff, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [startTime, setStartTime] = useState("");
  const [deadline, setDeadline] = useState("");
  const [phase, setPhase] = useState<"submission" | "evaluation" | "announcement">("submission");
  const [displayResults, setDisplayResults] = useState(false);
  const [params, setParams] = useState([
    { task_number: 1, param_1_title: "Score 1", param_2_title: "Score 2", param_3_title: "Score 3" },
    { task_number: 2, param_1_title: "Score 1", param_2_title: "Score 2", param_3_title: "Score 3" },
    { task_number: 3, param_1_title: "Score 1", param_2_title: "Score 2", param_3_title: "Score 3" },
    { task_number: 4, param_1_title: "Score 1", param_2_title: "Score 2", param_3_title: "Score 3" }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      // 1. Load site settings
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();
        
      if (settingsData) {
        if (settingsData.start_time) {
          const dateObj = new Date(settingsData.start_time);
          const tzoffset = dateObj.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(dateObj.getTime() - tzoffset)).toISOString().slice(0, 16);
          setStartTime(localISOTime);
        }
        if (settingsData.deadline) {
          const dateObj = new Date(settingsData.deadline);
          const tzoffset = dateObj.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(dateObj.getTime() - tzoffset)).toISOString().slice(0, 16);
          setDeadline(localISOTime);
        }
        if (settingsData.phase) {
          setPhase(settingsData.phase);
        }
        setDisplayResults(!!settingsData.display_results);
      }

      // 2. Load scoring parameters
      const { data: paramsData } = await supabase
        .from("scoring_parameters")
        .select("*")
        .order("task_number");

      if (paramsData && paramsData.length > 0) {
        // Map to state
        const mapped = [1, 2, 3, 4].map(taskNum => {
          const match = paramsData.find(p => p.task_number === taskNum);
          return match || { task_number: taskNum, param_1_title: "Score 1", param_2_title: "Score 2", param_3_title: "Score 3" };
        });
        setParams(mapped);
      }
      
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleParamChange = (taskNum: number, field: "param_1_title" | "param_2_title" | "param_3_title", value: string) => {
    setParams(prev => prev.map(p => {
      if (p.task_number === taskNum) {
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const utcDeadline = new Date(deadline).toISOString();
      const utcStartTime = startTime ? new Date(startTime).toISOString() : null;

      // 1. Save global settings
      const { error: settingsError } = await supabase
        .from("site_settings")
        .upsert({ 
          id: 1, 
          start_time: utcStartTime,
          deadline: utcDeadline,
          phase,
          display_results: displayResults
        });

      if (settingsError) throw settingsError;

      // 2. Save scoring parameters
      const { error: paramsError } = await supabase
        .from("scoring_parameters")
        .upsert(params);

      if (paramsError) throw paramsError;

      toast.success("System configurations updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update configurations");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500 gap-4">
        <Loader2 className="animate-spin" size={32} />
        <p className="font-mono text-sm uppercase tracking-widest">Loading System Settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-syne mb-2 text-foreground">System Settings</h1>
        <p className="text-muted-foreground font-mono text-sm">Global configurations, timelines, and parameter overrides</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Row 1: Timeline & Phase Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Timeline Panel */}
          <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
            <h2 className="text-lg font-bold font-syne mb-6 flex items-center gap-2 text-foreground border-b border-white/5 pb-3">
              <Clock size={20} className="text-red-500" />
              Timeline Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Start Time (Registration to Submission)
                </label>
                <input 
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-red-500/20 text-foreground outline-none focus:border-red-500/50 transition-colors font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Global Cutoff Time (Local Time)
                </label>
                <input 
                  type="datetime-local"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-red-500/20 text-foreground outline-none focus:border-red-500/50 transition-colors font-mono"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                Note: Before Start Time, students are in Registration Phase. After Cutoff, all submissions lock automatically across tasks.
              </p>
            </div>
          </div>

          {/* Phase Panel */}
          <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
            <h2 className="text-lg font-bold font-syne mb-6 flex items-center gap-2 text-foreground border-b border-white/5 pb-3">
              <Layers size={20} className="text-red-500" />
              Active Recruitment Phase
            </h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-3">
                {(["submission", "evaluation", "announcement"] as const).map((p) => {
                  const isActive = phase === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPhase(p)}
                      className={`py-3 px-4 rounded-xl border text-sm font-bold font-mono uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        isActive
                          ? "bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                          : "bg-black/40 border-red-500/10 text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <span>{p}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                {phase === "submission" && "Submission Phase: Applicants can freely initialize profiles and submit codes/metrics."}
                {phase === "evaluation" && "Evaluation Phase: Applicants are blocked from modifying files. Evaluators score submissions."}
                {phase === "announcement" && "Announcement Phase: Official announcements, scorecards, and overall leaderboards become viewable."}
              </p>
            </div>
          </div>

        </div>

        {/* Row 2: Visibility & Display Settings */}
        <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
          <h2 className="text-lg font-bold font-syne mb-6 flex items-center justify-between text-foreground border-b border-white/5 pb-3">
            <span className="flex items-center gap-2">
              {displayResults ? <Eye size={20} className="text-green-500" /> : <EyeOff size={20} className="text-red-500" />}
              Display Results to Students
            </span>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={displayResults}
                  onChange={(e) => setDisplayResults(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-mono">
            Enable this configuration to announce final scoring and unlock both individual scorecards and the overall color-highlighted thresholds leaderboard for students. If disabled, students will only see their own submissions and task-specific details.
          </p>
        </div>

        {/* Row 3: Parameter Configuration per Task */}
        <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
          <h2 className="text-lg font-bold font-syne mb-6 flex items-center gap-2 text-foreground border-b border-white/5 pb-3">
            <Sliders size={20} className="text-red-500" />
            Customize Scoring Metric Titles (3 Parameters Per Task)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {params.map((taskParams, idx) => {
              const taskColors = [
                "border-[var(--color-star-task1)]/20 hover:border-[var(--color-star-task1)]/40",
                "border-[var(--color-star-task2)]/20 hover:border-[var(--color-star-task2)]/40",
                "border-[var(--color-star-task3)]/20 hover:border-[var(--color-star-task3)]/40",
                "border-[#f97316]/20 hover:border-[#f97316]/40"
              ];
              const textColors = [
                "text-[var(--color-star-task1)]",
                "text-[var(--color-star-task2)]",
                "text-[var(--color-star-task3)]",
                "text-[#f97316]"
              ];

              return (
                <div 
                  key={taskParams.task_number} 
                  className={`bg-[#0a0a0c] border rounded-xl p-5 shadow-lg transition-all duration-300 ${taskColors[idx]}`}
                >
                  <h3 className={`font-bold font-syne text-md mb-4 flex items-center justify-between ${textColors[idx]}`}>
                    <span>Task {taskParams.task_number}</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Parameter Override</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1 font-mono">Parameter 1 Title</label>
                      <input 
                        type="text" 
                        required
                        value={taskParams.param_1_title}
                        onChange={(e) => handleParamChange(taskParams.task_number, "param_1_title", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-foreground outline-none focus:border-red-500/50 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1 font-mono">Parameter 2 Title</label>
                      <input 
                        type="text" 
                        required
                        value={taskParams.param_2_title}
                        onChange={(e) => handleParamChange(taskParams.task_number, "param_2_title", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-foreground outline-none focus:border-red-500/50 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1 font-mono">Parameter 3 Title</label>
                      <input 
                        type="text" 
                        required
                        value={taskParams.param_3_title}
                        onChange={(e) => handleParamChange(taskParams.task_number, "param_3_title", e.target.value)}
                        className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-foreground outline-none focus:border-red-500/50 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-red-500 text-white hover:bg-red-600 font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving Changes...
              </>
            ) : (
              <>
                <Save size={20} />
                Commit Configuration
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
