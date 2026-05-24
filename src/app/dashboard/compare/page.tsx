"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Users, FileCode, CheckCircle, Activity } from "lucide-react";

export default function ComparePage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubmissions: 0,
    task1Count: 0,
    task2Count: 0,
    task3Count: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStats() {
      // 1. Get total users
      const { count: usersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true }).eq('role', 'student');
      
      // 2. Get submissions grouped by task
      const { data: subs } = await supabase.from("submissions").select("task_number");
      
      let t1 = 0, t2 = 0, t3 = 0;
      subs?.forEach(s => {
        if (s.task_number === 1) t1++;
        if (s.task_number === 2) t2++;
        if (s.task_number === 3) t3++;
      });

      setStats({
        totalUsers: usersCount || 0,
        totalSubmissions: (subs?.length) || 0,
        task1Count: t1,
        task2Count: t2,
        task3Count: t3,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const pieData = [
    { name: 'Task 1', value: stats.task1Count, color: 'var(--color-star-task1)' },
    { name: 'Task 2', value: stats.task2Count, color: 'var(--color-star-task2)' },
    { name: 'Task 3', value: stats.task3Count, color: 'var(--color-star-task3)' },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] p-6 rounded-2xl flex items-center gap-4">
      <div className={`p-4 rounded-xl bg-background/50 border border-[var(--color-star-border)] ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <div className="text-sm text-muted-foreground font-mono uppercase tracking-widest mb-1">{title}</div>
        <div className="text-3xl font-bold font-syne">{loading ? "-" : value}</div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl md:text-4xl font-bold font-syne mb-8">
        Recruitment <span className="text-[var(--color-star-accent)]">Analytics</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Applicants" value={stats.totalUsers} icon={Users} colorClass="text-[var(--color-star-accent)]" />
        <StatCard title="Total Submissions" value={stats.totalSubmissions} icon={FileCode} colorClass="text-[var(--color-star-task2)]" />
        <StatCard title="Task 1 Completed" value={stats.task1Count} icon={CheckCircle} colorClass="text-[var(--color-star-task1)]" />
        <StatCard title="Task 3 Completed" value={stats.task3Count} icon={Activity} colorClass="text-[var(--color-star-task3)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Pie Chart */}
        <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] p-6 md:p-8 rounded-2xl">
          <h3 className="font-bold font-syne text-xl mb-6">Submission Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-star-surface2)', border: '1px solid var(--color-star-border)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-mono">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span>Task {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] p-6 md:p-8 rounded-2xl">
          <h3 className="font-bold font-syne text-xl mb-6">Task Popularity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-star-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-star-border)" tick={{fill: '#8a8780', fontSize: 12}} />
                <YAxis stroke="var(--color-star-border)" tick={{fill: '#8a8780', fontSize: 12}} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: 'var(--color-star-surface2)'}}
                  contentStyle={{ backgroundColor: 'var(--color-star-surface2)', border: '1px solid var(--color-star-border)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
