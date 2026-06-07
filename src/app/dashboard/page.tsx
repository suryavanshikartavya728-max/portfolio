"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code, Database, BrainCircuit, CheckCircle2, Clock, CircleDashed, AlertTriangle, Trophy, Medal, Award, Eye, FileText, Sparkles, Loader2, Rocket } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CountdownTimer from "@/components/star/CountdownTimer";
import { motion } from "framer-motion";
import { getEffectivePhase } from "@/lib/phase";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [taskStatuses, setTaskStatuses] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [ownEvaluations, setOwnEvaluations] = useState<any[]>([]);
  const [scoringParams, setScoringParams] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch site settings
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();
      setSettings(settingsData);

      // 2. Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // 3. Fetch task statuses
      const { data: statusData } = await supabase
        .from("task_statuses")
        .select("*")
        .eq("user_id", user.id);
      setTaskStatuses(statusData || []);

      // 4. Fetch own evaluations
      const { data: evData } = await supabase
        .from("submissions")
        .select(`
          task_number,
          is_reviewed,
          evaluations ( * )
        `)
        .eq("user_id", user.id);
      setOwnEvaluations(evData || []);

      // 5. Fetch scoring parameters
      const { data: paramsData } = await supabase
        .from("scoring_parameters")
        .select("*");
      setScoringParams(paramsData || []);

      setLoading(false);
    }
    
    loadDashboard();
  }, []);

  const getStatus = (taskNum: number) => {
    const s = taskStatuses.find(t => t.task_number === taskNum);
    return s?.status || 'not_attempted';
  };

  const getOwnTaskScore = (taskNum: number) => {
    const sub = ownEvaluations.find((s: any) => s.task_number === taskNum);
    const ev = sub?.evaluations ? (Array.isArray(sub.evaluations) ? sub.evaluations[0] : sub.evaluations) : null;
    if (!sub) return { status: "not_submitted", total: 0 };
    if (!sub.is_reviewed) return { status: "pending", total: 0 };
    if (ev?.is_invalid) return { status: "invalid", total: 0 };
    return { status: "reviewed", total: parseFloat(ev?.total_score) || 0, score_1: ev?.score_1, score_2: ev?.score_2, score_3: ev?.score_3 };
  };

  const getOwnParamTitles = (taskNum: number) => {
    const match = scoringParams.find(p => p.task_number === taskNum);
    return {
      p1: match?.param_1_title || "Score 1",
      p2: match?.param_2_title || "Score 2",
      p3: match?.param_3_title || "Score 3"
    };
  };



  const StatusBadge = ({ status }: { status: string }) => {
    if (profile?.is_disqualified) {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-mono uppercase tracking-wider">
          Locked
        </span>
      );
    }
    if (status === 'submitted') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-[var(--color-star-success)]/10 text-[var(--color-star-success)] border border-[var(--color-star-success)]/20 font-mono uppercase tracking-wider">
          <CheckCircle2 size={14} /> Submitted
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-mono uppercase tracking-wider">
          <Clock size={14} /> Pending
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 text-xs rounded-full bg-muted/10 text-muted-foreground border border-border font-mono uppercase tracking-wider">
        <CircleDashed size={14} /> Not Attempted
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500 gap-4">
        <Loader2 className="animate-spin" size={32} />
        <p className="font-mono text-sm uppercase tracking-widest">Initialising Dashboard...</p>
      </div>
    );
  }

  const isResultsActive = settings?.display_results || settings?.phase === "announcement";
  const ownOverallScore = [1, 2, 3].reduce((acc, taskNum) => {
    const sc = getOwnTaskScore(taskNum);
    return acc + (sc.status === "reviewed" ? sc.total : 0);
  }, 0);

  const effectivePhase = getEffectivePhase(settings);
  const isTaskLocked = profile?.is_disqualified || effectivePhase === "registration";

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      
      {/* 1. Disqualification Alert Banner */}
      {profile?.is_disqualified && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-red-400"
        >
          <AlertTriangle size={36} className="shrink-0 text-red-500 animate-pulse" />
          <div>
            <h3 className="font-bold text-lg font-syne uppercase tracking-wider">Applicant Disqualification Notice</h3>
            <p className="text-sm font-mono leading-relaxed mt-1">
              You have been disqualified from the STAR technical recruitment process by the evaluation board. Access to task submissions is permanently locked.
            </p>
          </div>
        </motion.div>
      )}

      {/* Header section with Countdown */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-[var(--color-star-surface)] border border-[var(--color-star-border)] p-6 md:p-8 rounded-2xl shadow-xl">
        <div>
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-[var(--color-star-accent)]/10 border border-[var(--color-star-accent)]/20 text-[var(--color-star-accent)] text-xs font-mono tracking-widest uppercase shadow-sm cursor-help group relative">
            <span>STAR Test</span>
            <div className="absolute top-full left-0 mt-2 whitespace-nowrap bg-[var(--color-star-surface2)] border border-[var(--color-star-border)] text-foreground text-xs px-3 py-2 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 normal-case tracking-normal">
              STAC Technical Assessment & Recruitment
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 font-syne">
            Welcome, <span className="text-[var(--color-star-accent)]">{profile?.full_name || "Applicant"}</span>
          </h1>
          <p className="text-muted-foreground font-mono">
            Roll No: {profile?.roll_number || "..."}
          </p>
        </div>
        
        {!profile?.is_disqualified && (
          <div className="bg-background/50 p-4 md:p-6 rounded-xl border border-[var(--color-star-border)] w-full md:w-auto min-w-[250px] flex items-center justify-center">
            {(effectivePhase === "registration" || effectivePhase === "submission") && <CountdownTimer />}
            
            {effectivePhase === "evaluation" && (
              <div className="flex flex-col items-center justify-center text-center">
                <BrainCircuit className="text-[var(--color-star-accent)] mb-3 animate-pulse" size={32} />
                <h3 className="font-bold font-syne text-lg">Evaluation in Progress</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1 max-w-[200px]">We are actively reviewing your submissions.</p>
              </div>
            )}
            
            {effectivePhase === "announcement" && (
              <div className="flex flex-col items-center justify-center text-center">
                <Trophy className="text-yellow-400 mb-3" size={36} />
                <h3 className="font-bold font-syne text-lg text-yellow-400">Final results are announced</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1 max-w-[200px] mb-4">Check your detailed scorecard.</p>
                
                <Link 
                  href="/dashboard/results" 
                  className="bg-[var(--color-star-accent)] text-black px-4 py-2 rounded-lg font-bold font-syne text-sm flex items-center gap-2 hover:bg-white transition-colors mt-2"
                >
                  <Trophy size={16} />
                  View Results
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tasks Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-syne border-b border-[var(--color-star-border)] pb-2">
          Assessment Tasks
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          
          {/* TASK 1 */}
          <Link href={isTaskLocked ? "#" : "/dashboard/task-1"} className={`group block h-full ${isTaskLocked ? "cursor-not-allowed pointer-events-none opacity-50" : ""}`}>
            <div className="h-full bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-[var(--color-star-task1)]/50 hover:bg-[var(--color-star-surface2)] flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-star-task1)]/10 flex items-center justify-center">
                  <Code className="text-[var(--color-star-task1)]" size={24} />
                </div>
                <StatusBadge status={getStatus(1)} />
              </div>
              
              <div className="mt-auto">
                <div className="text-[10px] text-[var(--color-star-task1)] font-mono uppercase tracking-widest mb-2">Task 01</div>
                <h3 className="text-xl font-bold mb-3 font-syne group-hover:text-[var(--color-star-task1)] transition-colors">
                  Club's Software Management
                </h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  Build a full-stack Inventory Management System for STAC. Handle authentication, role-based access, and equipment borrowing workflows.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-star-task1)]">
                  {isTaskLocked ? "LOCKED" : "View PS"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* TASK 2 */}
          <Link href={isTaskLocked ? "#" : "/dashboard/task-2"} className={`group block h-full ${isTaskLocked ? "cursor-not-allowed pointer-events-none opacity-50" : ""}`}>
            <div className="h-full bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-[var(--color-star-task2)]/50 hover:bg-[var(--color-star-surface2)] flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-star-task2)]/10 flex items-center justify-center">
                  <Database className="text-[var(--color-star-task2)]" size={24} />
                </div>
                <StatusBadge status={getStatus(2)} />
              </div>
              
              <div className="mt-auto">
                <div className="text-[10px] text-[var(--color-star-task2)] font-mono uppercase tracking-widest mb-2">Task 02</div>
                <h3 className="text-xl font-bold mb-3 font-syne group-hover:text-[var(--color-star-task2)] transition-colors">
                  Representation at Competitions
                </h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  Based on STAC's Inter IIT Tech Meet problem. Build an interactive dashboard to visualize and analyze lunar X-ray fluorescence spectroscopy datasets.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-star-task2)]">
                  {isTaskLocked ? "LOCKED" : "View PS"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* TASK 3 */}
          <Link href={isTaskLocked ? "#" : "/dashboard/task-3"} className={`group block h-full ${isTaskLocked ? "cursor-not-allowed pointer-events-none opacity-50" : ""}`}>
            <div className="h-full bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-[var(--color-star-task3)]/50 hover:bg-[var(--color-star-surface2)] flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-star-task3)]/10 flex items-center justify-center">
                  <BrainCircuit className="text-[var(--color-star-task3)]" size={24} />
                </div>
                <StatusBadge status={getStatus(3)} />
              </div>
              
              <div className="mt-auto">
                <div className="text-[10px] text-[var(--color-star-task3)] font-mono uppercase tracking-widest mb-2">Task 03</div>
                <h3 className="text-xl font-bold mb-3 font-syne group-hover:text-[var(--color-star-task3)] transition-colors">
                  Lead Software Projects
                </h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  Utilize the <code>lunadem</code> simulation library to classify lunar terrain. Open-ended problem requiring ML pipelines and rigorous metric tracking.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-star-task3)]">
                  {isTaskLocked ? "LOCKED" : "View PS"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* TASK 4 */}
          <Link href={isTaskLocked ? "#" : "/dashboard/task-4"} className={`group block h-full ${isTaskLocked ? "cursor-not-allowed pointer-events-none opacity-50" : ""}`}>
            <div className="h-full bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-orange-500/50 hover:bg-[var(--color-star-surface2)] flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Rocket className="text-orange-500" size={24} />
                </div>
                <StatusBadge status={getStatus(4)} />
              </div>
              
              <div className="mt-auto">
                <div className="text-[10px] text-orange-500 font-mono uppercase tracking-widest mb-2">Task 04</div>
                <h3 className="text-xl font-bold mb-3 font-syne group-hover:text-orange-500 transition-colors">
                  Hardware Systems Development
                </h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  Design the complete Electrical Subsystem and select the necessary avionics and sensors required for a high-altitude CanSat mission.
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-orange-500">
                  {isTaskLocked ? "LOCKED" : "View PS"} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
