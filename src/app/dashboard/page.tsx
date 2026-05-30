"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code, Database, BrainCircuit, CheckCircle2, Clock, CircleDashed } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import CountdownTimer from "@/components/star/CountdownTimer";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [taskStatuses, setTaskStatuses] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setProfile(profileData);

      // We should ideally fetch the actual tasks from the DB, but we'll mock the status mapping for the UI right now
      // Assuming tasks are 1, 2, 3
      const { data: statusData } = await supabase
        .from("task_statuses")
        .select("*")
        .eq("user_id", user.id);
        
      setTaskStatuses(statusData || []);
    }
    
    loadDashboard();
  }, []);

  const getStatus = (taskNum: number) => {
    const s = taskStatuses.find(t => t.task_number === taskNum);
    return s?.status || 'not_attempted';
  };

  const StatusBadge = ({ status }: { status: string }) => {
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

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
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
        
        <div className="bg-background/50 p-4 md:p-6 rounded-xl border border-[var(--color-star-border)] w-full md:w-auto">
          <CountdownTimer />
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-syne border-b border-[var(--color-star-border)] pb-2">
          Assessment Tasks
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          
          {/* TASK 1 */}
          <Link href="/dashboard/task-1" className="group block h-full">
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
                  View PS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* TASK 2 */}
          <Link href="/dashboard/task-2" className="group block h-full">
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
                  View PS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* TASK 3 */}
          <Link href="/dashboard/task-3" className="group block h-full">
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
                  View PS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
