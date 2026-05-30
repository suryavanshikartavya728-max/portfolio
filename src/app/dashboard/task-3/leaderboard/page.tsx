"use client";

import React, { useEffect, useState } from "react";
import TaskSubNav from "@/components/star/TaskSubNav";
import { createClient } from "@/lib/supabase/client";
import { Trophy, Medal, Award, AlertCircle } from "lucide-react";

export default function Task3Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadLeaderboard() {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          full_name,
          roll_number,
          is_disqualified,
          leaderboard!inner(overall_score, rank, is_overridden),
          submissions!inner(accuracy, f1_score, precision_score, recall, roc_auc)
        `)
        .eq("submissions.task_number", 3);

      if (error) {
        console.error("Leaderboard fetch error:", error);
      }

      if (data) {
        const calculatedData = data.map((entry: any) => {
          const subs = entry.submissions[0] || {};
          const accuracy = subs.accuracy || 0;
          const f1_score = subs.f1_score || 0;
          const roc_auc = subs.roc_auc || 0;
          
          const totalScore = (40 * accuracy) + (30 * f1_score) + (30 * roc_auc);
          
          return {
            ...entry,
            calculatedScore: totalScore
          };
        });

        const sorted = calculatedData.sort((a: any, b: any) => {
          return b.calculatedScore - a.calculatedScore;
        });
        setLeaderboard(sorted);
      }
      setLoading(false);
    }
    loadLeaderboard();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <h1 className="text-3xl font-bold font-syne mb-2 text-[var(--color-star-task3)]">
          Task 3: Leaderboard
        </h1>
        <p className="text-muted-foreground mb-8">
          Live rankings based on aggregate ML metrics.
        </p>

        <TaskSubNav taskNumber={3} />

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 flex gap-3">
          <AlertCircle className="text-yellow-500 shrink-0" />
          <p className="text-yellow-500/90 text-sm">
            Scores are calculated automatically based on submissions. Final rankings are subject to manual review of your Jupyter Notebook by the evaluation team.
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-[var(--color-star-surface2)] rounded-xl" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="mx-auto mb-4 opacity-20" size={48} />
            <p>No submissions yet. Be the first to appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-star-border)] text-muted-foreground text-sm font-mono uppercase tracking-wider">
                  <th className="pb-4 pl-4 font-medium">Rank</th>
                  <th className="pb-4 font-medium">Applicant</th>
                  <th className="pb-4 font-medium text-right">Accuracy</th>
                  <th className="pb-4 font-medium text-right hidden sm:table-cell">F1 Score</th>
                  <th className="pb-4 font-medium text-right hidden md:table-cell">ROC-AUC</th>
                  <th className="pb-4 pr-4 font-bold text-right text-[var(--color-star-task3)]">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let currentRank = 1;
                  return leaderboard.map((entry, index) => {
                  const lb = entry.leaderboard[0] || {};
                  const isDisq = !!entry.is_disqualified;
                  const profile = entry;
                  const subs = entry.submissions[0] || {};
                  
                  let rankDisplay = "DISQ";
                  let rankValue = 0;
                  if (!isDisq) {
                    rankValue = lb.is_overridden ? lb.rank : currentRank;
                    rankDisplay = `#${rankValue}`;
                    if (!lb.is_overridden) currentRank++;
                  }

                  return (
                    <tr key={profile.roll_number} className={`border-b border-[var(--color-star-border)]/50 hover:bg-[var(--color-star-surface2)] transition-colors group ${isDisq ? "bg-red-500/5 text-red-500/90" : ""}`}>
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-2">
                          {!isDisq && rankValue === 1 && <Trophy size={18} className="text-yellow-400" />}
                          {!isDisq && rankValue === 2 && <Medal size={18} className="text-gray-300" />}
                          {!isDisq && rankValue === 3 && <Award size={18} className="text-amber-600" />}
                          <span className={`font-mono font-bold ${isDisq ? "text-red-500" : rankValue <= 3 ? "text-lg" : "text-muted-foreground"}`}>
                            {rankDisplay}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-bold text-foreground font-syne">{profile.full_name}</div>
                          {isDisq && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-red-500/20 text-red-500 border border-red-500/30 uppercase tracking-widest font-mono">
                              Disqualified
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">{profile.roll_number}</div>
                      </td>
                      <td className="py-4 text-right font-mono text-sm">
                        {subs?.accuracy?.toFixed(4) || "0.0000"}
                      </td>
                      <td className="py-4 text-right font-mono text-sm hidden sm:table-cell text-muted-foreground group-hover:text-foreground transition-colors">
                        {subs?.f1_score?.toFixed(4) || "0.0000"}
                      </td>
                      <td className="py-4 text-right font-mono text-sm hidden md:table-cell text-muted-foreground group-hover:text-foreground transition-colors">
                        {subs?.roc_auc?.toFixed(4) || "0.0000"}
                      </td>
                      <td className="py-4 pr-4 text-right font-mono font-bold text-[var(--color-star-task3)]">
                        {profile.calculatedScore?.toFixed(4) || "0.0000"}
                      </td>
                    </tr>
                  );
                })})()}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
