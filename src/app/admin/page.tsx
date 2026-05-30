"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, FileText, CheckCircle2 } from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    users: 0,
    submissions: 0,
    completions: 0
  });
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      // Get users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      // Get total submissions
      const { count: subsCount } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true });

      // Get completions
      const { count: compCount } = await supabase
        .from("task_statuses")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      // Get role
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (profile) setUserRole(profile.role);
      }

      setStats({
        users: usersCount || 0,
        submissions: subsCount || 0,
        completions: compCount || 0
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-syne mb-2 text-foreground">System Overview</h1>
          <p className="text-muted-foreground font-mono text-sm">Real-time STAR portal metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Registered Students" 
          value={stats.users} 
          icon={Users} 
          loading={loading} 
        />
        <StatCard 
          title="Total Task Submissions" 
          value={stats.submissions} 
          icon={FileText} 
          loading={loading} 
        />
        <StatCard 
          title="Tasks Completed" 
          value={stats.completions} 
          icon={CheckCircle2} 
          loading={loading} 
        />
      </div>

      {userRole === "admin" && (
        <div className="mt-12 bg-black/40 border border-red-500/20 rounded-2xl p-8">
          <h3 className="text-xl font-bold font-syne mb-4 text-red-400">Admin Instructions</h3>
          <p className="text-muted-foreground mb-4">
            Welcome to the STAR Admin Command Center. From here, you possess full override authority over the recruitment portal.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground/80 font-mono text-sm">
            <li>Use <strong>Notifications</strong> to broadcast global alerts or task-specific hints. These appear directly on student dashboards.</li>
            <li>Use <strong>Overrides</strong> to manually edit student rankings on the Task 3 Leaderboard if their Jupyter Notebook proves their score was illegitimate.</li>
            <li>You can also reset a student's submission count in the Overrides tab if they face technical difficulties.</li>
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, loading }: { title: string, value: number, icon: any, loading: boolean }) {
  return (
    <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon size={80} className="text-red-500" />
      </div>
      <h3 className="text-muted-foreground text-sm font-bold tracking-wider uppercase mb-2 relative z-10">{title}</h3>
      {loading ? (
        <div className="h-10 w-24 bg-white/5 rounded animate-pulse relative z-10" />
      ) : (
        <p className="text-4xl font-mono font-bold text-foreground relative z-10">{value}</p>
      )}
    </div>
  );
}
