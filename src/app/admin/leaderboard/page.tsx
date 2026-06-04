"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Medal, Award, AlertTriangle, Save, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Threshold States
  const [t1Thresh, setT1Thresh] = useState("0");
  const [t2Thresh, setT2Thresh] = useState("0");
  const [t3Thresh, setT3Thresh] = useState("0");
  const [t4Thresh, setT4Thresh] = useState("0");
  const [totalThresh, setTotalThresh] = useState("0");
  const [isSavingThresh, setIsSavingThresh] = useState(false);

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);

    // 1. Fetch thresholds from site settings
    const { data: settingsData } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (settingsData) {
      setT1Thresh(settingsData.task_1_threshold?.toString() || "0");
      setT2Thresh(settingsData.task_2_threshold?.toString() || "0");
      setT3Thresh(settingsData.task_3_threshold?.toString() || "0");
      setT4Thresh(settingsData.task_4_threshold?.toString() || "0");
      setTotalThresh(settingsData.total_threshold?.toString() || "0");
    }

    // 2. Fetch current user role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (data) setUserRole(data.role);
    }

    // 3. Fetch profiles, submissions and evaluations
    const { data: profilesData } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        roll_number,
        is_disqualified,
        submissions (
          task_number,
          is_reviewed,
          evaluations (
            score_1,
            score_2,
            score_3,
            total_score,
            is_invalid
          )
        )
      `)
      .eq("role", "student");

    if (profilesData) {
      // Calculate scores
      const processed = profilesData.map((profile: any) => {
        let t1 = 0;
        let t2 = 0;
        let t3 = 0;
        let t4 = 0;

        profile.submissions?.forEach((sub: any) => {
          const evalObj = Array.isArray(sub.evaluations) ? sub.evaluations[0] : sub.evaluations;
          if (evalObj && !evalObj.is_invalid && sub.is_reviewed) {
            const score = parseFloat(evalObj.total_score) || 0;
            if (sub.task_number === 1) t1 = score;
            if (sub.task_number === 2) t2 = score;
            if (sub.task_number === 3) t3 = score;
            if (sub.task_number === 4) t4 = score;
          }
        });

        const overall = t1 + t2 + t3 + t4;

        return {
          id: profile.id,
          full_name: profile.full_name,
          roll_number: profile.roll_number,
          is_disqualified: !!profile.is_disqualified,
          t1,
          t2,
          t3,
          t4,
          overall
        };
      });

      // Sort by overall score descending
      const sorted = processed.sort((a: any, b: any) => {
        return b.overall - a.overall;
      });

      setLeaderboard(sorted);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveThresholds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== "admin") {
      toast.error("Only admins can modify thresholds.");
      return;
    }

    setIsSavingThresh(true);

    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          task_1_threshold: parseFloat(t1Thresh) || 0,
          task_2_threshold: parseFloat(t2Thresh) || 0,
          task_3_threshold: parseFloat(t3Thresh) || 0,
          task_4_threshold: parseFloat(t4Thresh) || 0,
          total_threshold: parseFloat(totalThresh) || 0
        })
        .eq("id", 1);

      if (error) throw error;
      toast.success("Leaderboard thresholds committed successfully!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save thresholds");
    } finally {
      setIsSavingThresh(false);
    }
  };

  const getHighlightClass = (row: any) => {
    if (row.is_disqualified) return "border-red-500/30 bg-red-950/10 text-red-500/90";

    const t1Limit = parseFloat(t1Thresh) || 0;
    const t2Limit = parseFloat(t2Thresh) || 0;
    const t3Limit = parseFloat(t3Thresh) || 0;
    const t4Limit = parseFloat(t4Thresh) || 0;
    const totalLimit = parseFloat(totalThresh) || 0;

    const q1 = row.t1 >= t1Limit;
    const q2 = row.t2 >= t2Limit;
    const q3 = row.t3 >= t3Limit;
    const q4 = row.t4 >= t4Limit;
    const qTotal = row.overall >= totalLimit;

    // Golden if ALL cleared
    if (q1 && q2 && q3 && q4 && qTotal) {
      return "border-yellow-500/40 bg-yellow-500/5 text-yellow-400 font-bold relative overflow-hidden group shadow-[inset_0_0_15px_rgba(234,179,8,0.15)] after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-yellow-500/5 after:to-transparent after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-1000";
    }

    // Green if AT LEAST ONE cleared
    if (q1 || q2 || q3 || q4 || qTotal) {
      return "border-green-500/25 bg-green-500/5 text-green-400";
    }

    // Default red/crimson
    return "border-red-500/20 bg-red-500/5 text-red-400";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-syne mb-2 text-foreground">Overall Leaderboard</h1>
          <p className="text-muted-foreground font-mono text-sm">Review aggregate applicant rankings and thresholds</p>
        </div>
        <button
          onClick={loadData}
          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Threshold Panels (Editable by Admin) */}
      <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
        <h2 className="text-lg font-bold font-syne mb-4 flex items-center justify-between border-b border-white/5 pb-2">
          <span>Recruitment Threshold Settings</span>
          {userRole !== "admin" && (
            <span className="text-xs text-muted-foreground font-mono uppercase">Read Only (Admin Permission Required)</span>
          )}
        </h2>
        
        <form onSubmit={handleSaveThresholds} className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1">Task 1 Threshold</label>
              <input
                type="number"
                step="0.01"
                required
                disabled={userRole !== "admin"}
                value={t1Thresh}
                onChange={e => setT1Thresh(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black border border-white/10 text-foreground font-mono outline-none focus:border-red-500/50 text-sm disabled:opacity-40"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1">Task 2 Threshold</label>
              <input
                type="number"
                step="0.01"
                required
                disabled={userRole !== "admin"}
                value={t2Thresh}
                onChange={e => setT2Thresh(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black border border-white/10 text-foreground font-mono outline-none focus:border-red-500/50 text-sm disabled:opacity-40"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1">Task 3 Threshold</label>
              <input
                type="number"
                step="0.01"
                required
                disabled={userRole !== "admin"}
                value={t3Thresh}
                onChange={e => setT3Thresh(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black border border-white/10 text-foreground font-mono outline-none focus:border-red-500/50 text-sm disabled:opacity-40"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1">Task 4 Threshold</label>
              <input
                type="number"
                step="0.01"
                required
                disabled={userRole !== "admin"}
                value={t4Thresh}
                onChange={e => setT4Thresh(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black border border-white/10 text-foreground font-mono outline-none focus:border-red-500/50 text-sm disabled:opacity-40"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1">Overall Total Threshold</label>
              <input
                type="number"
                step="0.01"
                required
                disabled={userRole !== "admin"}
                value={totalThresh}
                onChange={e => setTotalThresh(e.target.value)}
                className="w-full px-3 py-2 rounded bg-black border border-white/10 text-foreground font-mono outline-none focus:border-red-500/50 text-sm disabled:opacity-40"
              />
            </div>
          </div>
          
          {userRole === "admin" && (
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingThresh}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-5 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSavingThresh ? (
                  <>
                    <Loader2 className="animate-spin" size={12} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={12} />
                    Apply Thresholds
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Leaderboard Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-4">
          <Loader2 className="animate-spin" size={32} />
          <p className="font-mono text-sm uppercase tracking-widest">Loading Rankings...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-black/40 border border-red-500/20 rounded-2xl">
          <Trophy className="mx-auto mb-4 opacity-20" size={48} />
          <p className="font-mono text-sm">No evaluated student submissions found yet.</p>
        </div>
      ) : (
        <div className="bg-black/40 border border-red-500/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-red-500/20 text-muted-foreground text-sm font-mono uppercase tracking-wider bg-black/60">
                  <th className="p-4 font-medium">Rank</th>
                  <th className="p-4 font-medium">Applicant</th>
                  <th className="p-4 font-medium text-center font-mono">Task 1</th>
                  <th className="p-4 font-medium text-center font-mono">Task 2</th>
                  <th className="p-4 font-medium text-center font-mono">Task 3</th>
                  <th className="p-4 font-medium text-center font-mono">Task 4</th>
                  <th className="p-4 font-medium text-right font-mono text-[var(--color-star-accent)]">Overall Score</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let currentRank = 1;
                  return leaderboard.map((row, index) => {
                    const highlightClass = getHighlightClass(row);
                    const isGold = highlightClass.includes("yellow-500");
                    const isGreen = highlightClass.includes("green-500");
                    const isDisq = row.is_disqualified;

                    let rankDisplay = "DISQ";
                    let rankValue = 0;
                    if (!isDisq) {
                      rankValue = currentRank;
                      rankDisplay = `#${rankValue}`;
                      currentRank++;
                    }

                    return (
                      <tr
                        key={row.roll_number}
                        className={`border-b border-red-500/10 hover:bg-white/5 transition-all duration-300 ${highlightClass}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {!isDisq && rankValue === 1 && <Trophy size={18} className="text-yellow-400" />}
                            {!isDisq && rankValue === 2 && <Medal size={18} className="text-gray-300" />}
                            {!isDisq && rankValue === 3 && <Award size={18} className="text-amber-600" />}
                            <span className="font-mono font-bold">{rankDisplay}</span>
                          </div>
                        </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="font-bold font-syne">{row.full_name}</div>
                          {isDisq && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-500/20 text-red-500 border border-red-500/30 uppercase tracking-widest font-mono">
                              Disqualified
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono">{row.roll_number}</div>
                      </td>
                      <td className="p-4 text-center font-mono">{row.t1.toFixed(2)}</td>
                      <td className="p-4 text-center font-mono">{row.t2.toFixed(2)}</td>
                      <td className="p-4 text-center font-mono">{row.t3.toFixed(2)}</td>
                      <td className="p-4 text-center font-mono">{row.t4.toFixed(2)}</td>
                      <td className="p-4 text-right font-mono font-bold text-lg">
                        {row.overall.toFixed(2)}
                      </td>
                    </tr>
                  );
                })})()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
