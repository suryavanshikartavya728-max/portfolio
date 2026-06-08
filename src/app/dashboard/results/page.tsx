"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Sparkles, AlertTriangle, Loader2, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function ResultsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [ownEvaluations, setOwnEvaluations] = useState<any[]>([]);
  const [scoringParams, setScoringParams] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadResults() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: settingsData } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      setSettings(settingsData);

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      const { data: evData } = await supabase
        .from("submissions")
        .select(`task_number, is_reviewed, evaluations ( * )`)
        .eq("user_id", user.id);
      setOwnEvaluations(evData || []);

      const { data: paramsData } = await supabase.from("scoring_parameters").select("*");
      setScoringParams(paramsData || []);

      const isResultsActive = settingsData?.display_results || settingsData?.phase === "announcement";
      
      if (isResultsActive) {
        const { data: lbData } = await supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            roll_number,
            is_disqualified,
            is_club_member,
            submissions (
              task_number,
              is_reviewed,
              evaluations ( total_score, is_invalid )
            )
          `)
          .eq("role", "student");

        if (lbData) {
          const processed = lbData.map((p: any) => {
            let t1 = 0, t2 = 0, t3 = 0, t4 = 0;
            p.submissions?.forEach((sub: any) => {
              const ev = Array.isArray(sub.evaluations) ? sub.evaluations[0] : sub.evaluations;
              if (ev && !ev.is_invalid && sub.is_reviewed) {
                const sc = parseFloat(ev.total_score) || 0;
                if (sub.task_number === 1) t1 = sc;
                if (sub.task_number === 2) t2 = sc;
                if (sub.task_number === 3) t3 = sc;
                if (sub.task_number === 4) t4 = sc;
              }
            });
            return {
              id: p.id,
              full_name: p.full_name,
              roll_number: p.roll_number,
              is_disqualified: !!p.is_disqualified,
              is_club_member: !!p.is_club_member,
              t1, t2, t3, t4,
              overall: t1 + t2 + t3 + t4
            };
          });

          const sorted = processed.sort((a: any, b: any) => {
            return b.overall - a.overall;
          });
          
          setLeaderboard(sorted);

          // Find own rank skipping disqualified users and club members
          if (!profileData.is_disqualified && !profileData.is_club_member) {
            let ownRank = 0;
            let currentRank = 1;
            for (const p of sorted) {
              if (!p.is_disqualified && !p.is_club_member) {
                if (p.id === user.id) {
                  ownRank = currentRank;
                  break;
                }
                currentRank++;
              }
            }
            if (ownRank > 0) setRank(ownRank);
          }
        }
      }
      setLoading(false);
    }
    
    loadResults();
  }, [supabase]);

  const getOwnTaskScore = (taskNum: number) => {
    const sub = ownEvaluations.find((s: any) => s.task_number === taskNum);
    const ev = sub?.evaluations ? (Array.isArray(sub.evaluations) ? sub.evaluations[0] : sub.evaluations) : null;
    if (!sub) return { status: "not_submitted", total: 0 };
    if (!sub.is_reviewed) return { status: "pending", total: 0 };
    if (ev?.is_invalid) return { status: "invalid", total: 0 };
    return { status: "reviewed", total: parseFloat(ev?.total_score) || 0, score_1: ev?.score_1, score_2: ev?.score_2, score_3: ev?.score_3, remarks: ev?.remarks };
  };

  const getOwnParamTitles = (taskNum: number) => {
    const match = scoringParams.find(p => p.task_number === taskNum);
    return {
      p1: match?.param_1_title || "Score 1",
      p2: match?.param_2_title || "Score 2",
      p3: match?.param_3_title || "Score 3"
    };
  };

  const getHighlightClass = (row: any) => {
    if (row.is_disqualified) return "border-red-500/30 bg-red-950/10 text-red-500/90";
    if (row.is_club_member) return "border-blue-500/40 bg-blue-500/10 text-blue-400";

    const t1Limit = settings?.task_1_threshold || 0;
    const t2Limit = settings?.task_2_threshold || 0;
    const t3Limit = settings?.task_3_threshold || 0;
    const t4Limit = settings?.task_4_threshold || 0;
    const totalLimit = settings?.total_threshold || 0;

    const q1 = row.t1 >= t1Limit;
    const q2 = row.t2 >= t2Limit;
    const q3 = row.t3 >= t3Limit;
    const q4 = row.t4 >= t4Limit;
    const qTotal = row.overall >= totalLimit;

    if (q1 && q2 && q3 && q4 && qTotal) {
      return "border-yellow-500/40 bg-yellow-500/5 text-yellow-400 font-bold relative overflow-hidden group shadow-[inset_0_0_15px_rgba(234,179,8,0.15)] after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-yellow-500/5 after:to-transparent after:translate-x-[-100%] hover:after:translate-x-[100%] after:transition-transform after:duration-1000";
    }

    if (q1 || q2 || q3 || q4 || qTotal) {
      return "border-green-500/25 bg-green-500/5 text-green-400";
    }

    return "border-red-500/20 bg-red-500/5 text-red-400";
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500 gap-4">
        <Loader2 className="animate-spin" size={32} />
        <p className="font-mono text-sm uppercase tracking-widest">Compiling Results...</p>
      </div>
    );
  }

  const isResultsActive = settings?.display_results || settings?.phase === "announcement";

  if (!isResultsActive) {
    return (
      <div className="max-w-4xl mx-auto mt-20">
        <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-10 text-center flex flex-col items-center justify-center">
          <Trophy className="text-muted-foreground/30 mb-6" size={64} />
          <h2 className="text-3xl font-bold font-syne mb-4">Results Not Yet Available</h2>
          <p className="text-muted-foreground font-mono max-w-md">
            The evaluation process is still ongoing. Detailed scores, thresholds, and the overall leaderboard will be visible here during the announcement phase.
          </p>
        </div>
      </div>
    );
  }

  const ownOverallScore = [1, 2, 3, 4].reduce((acc, taskNum) => {
    const sc = getOwnTaskScore(taskNum);
    return acc + (sc.status === "reviewed" ? sc.total : 0);
  }, 0);

  const ownT1 = getOwnTaskScore(1).status === "reviewed" ? getOwnTaskScore(1).total : 0;
  const ownT2 = getOwnTaskScore(2).status === "reviewed" ? getOwnTaskScore(2).total : 0;
  const ownT3 = getOwnTaskScore(3).status === "reviewed" ? getOwnTaskScore(3).total : 0;
  const ownT4 = getOwnTaskScore(4).status === "reviewed" ? getOwnTaskScore(4).total : 0;

  const q1 = ownT1 >= (settings?.task_1_threshold || 0);
  const q2 = ownT2 >= (settings?.task_2_threshold || 0);
  const q3 = ownT3 >= (settings?.task_3_threshold || 0);
  const q4 = ownT4 >= (settings?.task_4_threshold || 0);
  const qTotal = ownOverallScore >= (settings?.total_threshold || 0);
  
  const isQualified = q1 || q2 || q3 || q4 || qTotal;

  // Best Performers Calculations
  const validUsers = leaderboard.filter(u => !u.is_disqualified);
  const bestOverall = validUsers.reduce((prev, current) => (prev.overall > current.overall) ? prev : current, validUsers[0] || null);
  const bestT1 = validUsers.reduce((prev, current) => (prev.t1 > current.t1) ? prev : current, validUsers[0] || null);
  const bestT2 = validUsers.reduce((prev, current) => (prev.t2 > current.t2) ? prev : current, validUsers[0] || null);
  const bestT3 = validUsers.reduce((prev, current) => (prev.t3 > current.t3) ? prev : current, validUsers[0] || null);
  const bestT4 = validUsers.reduce((prev, current) => (prev.t4 > current.t4) ? prev : current, validUsers[0] || null);

  const topPerformers = [
    { category: "Overall Highest Scorer", user: bestOverall, score: bestOverall?.overall },
    { category: "Task 1 Best Performer", user: bestT1, score: bestT1?.t1 },
    { category: "Task 2 Best Performer", user: bestT2, score: bestT2?.t2 },
    { category: "Task 3 Best Performer", user: bestT3, score: bestT3?.t3 },
    { category: "Task 4 Best Performer", user: bestT4, score: bestT4?.t4 },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
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
              You have been disqualified. Your scores have been nullified and rank removed.
            </p>
          </div>
        </motion.div>
      )}

      {/* Evaluation Scorecard */}
      {!profile?.is_disqualified && (
        <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-6">
            <div>
              <h2 className="text-2xl font-bold font-syne text-foreground flex items-center gap-2 mb-2">
                <Sparkles className="text-[var(--color-star-accent)]" size={28} />
                Detailed Evaluation Report
              </h2>
              <p className="text-sm text-muted-foreground font-mono">
                Compare your task scores against the official threshold cutoffs.
              </p>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Global Rank</div>
                <div className="text-3xl font-bold font-mono text-yellow-500">
                  {profile?.is_club_member ? <span className="text-xl text-blue-500">CLUB MEMBER</span> : (rank ? `#${rank}` : "N/A")}
                </div>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block"></div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground font-mono uppercase mb-1">Total Score</div>
                <div className="text-3xl font-bold font-mono text-[var(--color-star-accent)]">
                  {ownOverallScore.toFixed(2)}
                </div>
                <div className="flex items-center justify-end gap-2 text-xs font-mono mt-2">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${isQualified ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {isQualified ? "QUALIFIED" : "NOT QUALIFIED"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((taskNum) => {
              const sc = getOwnTaskScore(taskNum);
              const titles = getOwnParamTitles(taskNum);
              const limit = taskNum === 1 ? settings?.task_1_threshold : taskNum === 2 ? settings?.task_2_threshold : taskNum === 3 ? settings?.task_3_threshold : settings?.task_4_threshold;
              const limitVal = parseFloat(limit) || 0;
              const margin = sc.status === "reviewed" ? sc.total - limitVal : 0;
              
              const borderColors = ["border-[var(--color-star-task1)]/20", "border-[var(--color-star-task2)]/20", "border-[var(--color-star-task3)]/20", "border-[#f97316]/20"];
              const textColors = ["text-[var(--color-star-task1)]", "text-[var(--color-star-task2)]", "text-[var(--color-star-task3)]", "text-[#f97316]"];

              return (
                <div key={taskNum} className={`bg-[#0a0a0c] border rounded-xl p-5 flex flex-col ${borderColors[taskNum - 1]}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`font-bold font-syne text-sm uppercase tracking-wider ${textColors[taskNum - 1]}`}>
                      Task {taskNum}
                    </h3>
                    {sc.status === "reviewed" && (
                      <div className="text-right">
                        <span className="text-lg font-bold font-mono">{sc.total.toFixed(2)}</span>
                        <div className="text-[10px] text-muted-foreground font-mono">Cutoff: {limitVal}</div>
                      </div>
                    )}
                  </div>
                  
                  {sc.status === "not_submitted" && <p className="text-xs text-muted-foreground font-mono italic my-auto">No submission.</p>}
                  {sc.status === "pending" && <p className="text-xs text-yellow-500 font-mono my-auto">Pending review.</p>}
                  {sc.status === "invalid" && <p className="text-xs text-red-500 font-mono my-auto">Invalidated.</p>}
                  {sc.status === "reviewed" && (
                    <>
                      <div className="space-y-3 font-mono mt-2 flex-grow">
                        <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground bg-white/5 p-3 rounded-lg">
                          <div className="flex flex-col relative group cursor-help">
                            <span className="truncate">{titles.p1}</span>
                            <div className="absolute bottom-full mb-1 left-0 bg-[var(--color-star-surface)] border border-[var(--color-star-border)] text-xs text-foreground p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                              {titles.p1}
                            </div>
                            <strong className="text-white text-xs mt-1">{sc.score_1}</strong>
                          </div>
                          <div className="flex flex-col relative group cursor-help">
                            <span className="truncate">{titles.p2}</span>
                            <div className="absolute bottom-full mb-1 left-0 bg-[var(--color-star-surface)] border border-[var(--color-star-border)] text-xs text-foreground p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                              {titles.p2}
                            </div>
                            <strong className="text-white text-xs mt-1">{sc.score_2}</strong>
                          </div>
                          <div className="flex flex-col relative group cursor-help">
                            <span className="truncate">{titles.p3}</span>
                            <div className="absolute bottom-full mb-1 left-0 bg-[var(--color-star-surface)] border border-[var(--color-star-border)] text-xs text-foreground p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                              {titles.p3}
                            </div>
                            <strong className="text-white text-xs mt-1">{sc.score_3}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs font-mono bg-black/20 px-3 py-2 rounded">
                        <span className="text-muted-foreground">Threshold Passed?</span>
                        {margin >= 0 ? (
                          <span className="text-green-500 font-bold">YES</span>
                        ) : (
                          <span className="text-red-500 font-bold">NO</span>
                        )}
                      </div>
                      {sc.remarks && (
                        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-200/90 italic">
                          <span className="font-bold text-blue-400 not-italic block mb-1">Evaluator Remarks:</span>
                          {sc.remarks}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Performers Table */}
      <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="border-b border-white/5 pb-4 mb-6">
          <h2 className="text-xl font-bold font-syne text-foreground flex items-center gap-2">
            <Sparkles className="text-yellow-500" size={24} />
            Hall of Fame: Top Performers
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Celebrating the highest scorers across each individual task and overall performance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topPerformers.map((perf, i) => (
            <div key={i} className="bg-[#0a0a0c] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
              <div className="text-[10px] text-muted-foreground font-mono uppercase mb-2 tracking-wider">{perf.category}</div>
              {perf.user ? (
                <div>
                  <div className="font-bold text-sm font-syne text-[var(--color-star-accent)] line-clamp-1" title={perf.user.full_name}>
                    {perf.user.full_name}
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-xs font-mono text-muted-foreground">{perf.user.roll_number}</span>
                    <span className="font-mono font-bold text-white">{perf.score?.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-xs italic font-mono mt-2">No data yet</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overall Leaderboard */}
      <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="border-b border-white/5 pb-4 mb-6">
          <h2 className="text-xl font-bold font-syne text-foreground flex items-center gap-2">
            <Trophy className="text-yellow-500" size={24} />
            Overall Recruitment Leaderboard
          </h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Top threshold highlights: Gold Shimmer represents cleared all criteria. Green represents cleared at least one.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-red-500/20 text-muted-foreground text-[10px] font-mono uppercase bg-black/60">
                <th className="p-3 font-medium">Rank</th>
                <th className="p-3 font-medium">Applicant</th>
                <th className="p-3 font-medium text-center font-mono">Task 1</th>
                <th className="p-3 font-medium text-center font-mono">Task 2</th>
                <th className="p-3 font-medium text-center font-mono">Task 3</th>
                <th className="p-3 font-medium text-center font-mono">Task 4</th>
                <th className="p-3 font-medium text-right font-mono text-[var(--color-star-accent)]">Overall Score</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let currentRank = 1;
                  return leaderboard.map((row, index) => {
                  const highlightClass = getHighlightClass(row);
                  const isDisq = row.is_disqualified;
                  const isClub = row.is_club_member;
                  
                  let rankDisplay = "DISQ";
                  if (!isDisq) {
                    if (isClub) {
                      rankDisplay = "CLUB MEMBER";
                    } else {
                      rankDisplay = `#${currentRank}`;
                      currentRank++;
                    }
                  }

                  const isMe = row.id === profile?.id;

                return (
                  <tr
                    key={row.roll_number}
                    className={`border-b border-red-500/10 transition-all duration-300 text-sm ${highlightClass} ${isMe ? 'bg-white/5 border-l-2 border-l-[var(--color-star-accent)]' : ''}`}
                  >
                    <td className="p-3 font-mono font-bold text-xs">{rankDisplay} {isMe && <span className="text-[9px] ml-2 bg-[var(--color-star-accent)]/20 text-[var(--color-star-accent)] px-1 rounded uppercase">You</span>}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="font-bold font-syne">{row.full_name}</div>
                        {isDisq && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-500/20 text-red-500 border border-red-500/30 uppercase tracking-widest font-mono">
                            Disqualified
                          </span>
                        )}
                        {isClub && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-500/20 text-blue-500 border border-blue-500/30 uppercase tracking-widest font-mono">
                            Club Member
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono opacity-80">{row.roll_number}</div>
                    </td>
                    <td className="p-3 text-center font-mono">{row.t1.toFixed(2)}</td>
                    <td className="p-3 text-center font-mono">{row.t2.toFixed(2)}</td>
                    <td className="p-3 text-center font-mono">{row.t3.toFixed(2)}</td>
                    <td className="p-3 text-center font-mono">{row.t4.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold">
                      {row.overall.toFixed(2)}
                    </td>
                  </tr>
                );
              })})()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
