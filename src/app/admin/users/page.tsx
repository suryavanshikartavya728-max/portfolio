"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Search, Loader2, Undo2, Check, RefreshCw, ChevronDown, ChevronUp, Code, Globe, FileText, Activity } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function UserSubmissionsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        roll_number,
        task_statuses ( task_number, status ),
        submissions ( * )
      `)
      .eq("role", "student")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } else {
      setUsers(data || []);
      setFilteredUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = users;
    if (taskFilter !== "all") {
      filtered = filtered.filter((u) =>
        u.task_statuses.some((ts: any) => ts.task_number === taskFilter && ts.status === "submitted")
      );
    }
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.full_name.toLowerCase().includes(lowerQ) ||
          u.roll_number.toLowerCase().includes(lowerQ)
      );
    }
    setFilteredUsers(filtered);
  }, [taskFilter, searchQuery, users]);

  const handleMarkReviewed = async (submissionId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("submissions")
      .update({ is_reviewed: !currentStatus })
      .eq("id", submissionId);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(currentStatus ? "Marked as unreviewed" : "Marked as reviewed");
      loadData();
    }
  };

  const handleUndoSubmission = async (userId: string, taskNumber: number) => {
    if (
      !window.confirm(
        `Are you sure you want to undo Task ${taskNumber} for this user? This will permanently delete the submission record.`
      )
    ) {
      return;
    }

    try {
      const { error: subError } = await supabase
        .from("submissions")
        .delete()
        .eq("user_id", userId)
        .eq("task_number", taskNumber);

      if (subError) throw subError;

      const { error: statusError } = await supabase
        .from("task_statuses")
        .update({ status: "not_attempted" })
        .eq("user_id", userId)
        .eq("task_number", taskNumber);

      if (statusError) throw statusError;

      if (taskNumber === 3) {
        await supabase.from("leaderboard").delete().eq("user_id", userId);
      }

      toast.success(`Task ${taskNumber} submission undone successfully`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  const toggleExpand = (userId: string) => {
    setExpandedUserId((prev) => (prev === userId ? null : userId));
  };

  const getCompletedCount = (user: any) => {
    return user.task_statuses.filter((ts: any) => ts.status === "submitted").length;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-syne mb-2 text-foreground">User Submissions</h1>
          <p className="text-muted-foreground font-mono text-sm">Review & Manage applicant submissions</p>
        </div>
        <button
          onClick={loadData}
          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/40 border border-red-500/20 rounded-xl text-foreground focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {["all", 1, 2, 3].map((f) => (
            <button
              key={f}
              onClick={() => setTaskFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                taskFilter === f
                  ? "bg-red-500 text-white"
                  : "bg-black/40 border border-red-500/20 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
              }`}
            >
              {f === "all" ? "All Users" : `Task ${f} Submissions`}
            </button>
          ))}
        </div>
      </div>

      {loading && users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-red-500 gap-4">
          <Loader2 className="animate-spin" size={32} />
          <p className="font-mono text-sm uppercase tracking-widest">Loading Profiles...</p>
        </div>
      ) : (
        <div className="bg-black/40 border border-red-500/20 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-red-500/20 text-muted-foreground text-sm font-mono uppercase tracking-wider bg-black/60">
                  <th className="p-4 font-medium">Applicant</th>
                  <th className="p-4 font-medium text-center">Tasks Completed</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-muted-foreground">
                      No users found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isExpanded = expandedUserId === user.id;
                    const completedCount = getCompletedCount(user);

                    return (
                      <React.Fragment key={user.id}>
                        <tr
                          className={`border-b border-red-500/10 hover:bg-red-500/5 transition-colors cursor-pointer ${
                            isExpanded ? "bg-red-500/5" : ""
                          }`}
                          onClick={() => toggleExpand(user.id)}
                        >
                          <td className="p-4">
                            <div className="font-bold text-foreground font-syne">{user.full_name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{user.roll_number}</div>
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-mono font-bold ${
                                completedCount === 3
                                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                  : completedCount > 0
                                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                  : "bg-white/5 text-muted-foreground border border-white/10"
                              }`}
                            >
                              {completedCount} / 3
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button className="text-muted-foreground hover:text-red-400 transition-colors p-2">
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                          </td>
                        </tr>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <tr>
                              <td colSpan={3} className="p-0 border-b border-red-500/20">
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden bg-black/60"
                                >
                                  <div className="p-6 space-y-6">
                                    {user.submissions.length === 0 ? (
                                      <div className="text-center text-muted-foreground py-4 font-mono text-sm">
                                        No submissions yet.
                                      </div>
                                    ) : (
                                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {user.submissions.map((sub: any) => (
                                          <div
                                            key={sub.id}
                                            className="bg-[#0a0a0c] border border-red-500/20 rounded-xl p-5 shadow-lg relative"
                                          >
                                            <div className="flex justify-between items-start mb-4">
                                              <div>
                                                <h4 className="font-bold text-red-400 font-syne text-lg">
                                                  Task {sub.task_number}
                                                </h4>
                                                <p className="text-xs text-muted-foreground font-mono mt-1">
                                                  Submitted: {new Date(sub.submitted_at).toLocaleString()}
                                                </p>
                                              </div>
                                              <span
                                                className={`px-2 py-1 text-xs rounded-md font-mono ${
                                                  sub.is_reviewed
                                                    ? "bg-green-500/10 text-green-500"
                                                    : "bg-yellow-500/10 text-yellow-500"
                                                }`}
                                              >
                                                {sub.is_reviewed ? "Reviewed" : "Pending Review"}
                                              </span>
                                            </div>

                                            <div className="space-y-3 mb-6">
                                              <a
                                                href={sub.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors break-all"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <Code size={16} className="shrink-0" /> {sub.github_url}
                                              </a>
                                              {sub.deployed_url && (
                                                <a
                                                  href={sub.deployed_url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors break-all"
                                                  onClick={(e) => e.stopPropagation()}
                                                >
                                                  <Globe size={16} className="shrink-0" /> {sub.deployed_url}
                                                </a>
                                              )}
                                            </div>

                                            {/* Task 3 Metrics */}
                                            {sub.task_number === 3 && (
                                              <div className="mb-6 grid grid-cols-2 gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                                                <div className="flex items-center gap-2 text-sm">
                                                  <Activity size={14} className="text-red-400" />
                                                  <span className="text-muted-foreground">Accuracy:</span>
                                                  <strong className="font-mono">{sub.accuracy?.toFixed(4) || "N/A"}</strong>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                  <FileText size={14} className="text-red-400" />
                                                  <span className="text-muted-foreground">F1 Score:</span>
                                                  <strong className="font-mono">{sub.f1_score?.toFixed(4) || "N/A"}</strong>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                  <FileText size={14} className="text-red-400" />
                                                  <span className="text-muted-foreground">ROC-AUC:</span>
                                                  <strong className="font-mono">{sub.roc_auc?.toFixed(4) || "N/A"}</strong>
                                                </div>
                                              </div>
                                            )}

                                            <div className="flex flex-wrap gap-2 pt-4 border-t border-red-500/20">
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleMarkReviewed(sub.id, sub.is_reviewed);
                                                }}
                                                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                  sub.is_reviewed
                                                    ? "bg-white/5 text-muted-foreground hover:bg-white/10"
                                                    : "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                                                }`}
                                              >
                                                <Check size={16} />
                                                {sub.is_reviewed ? "Mark Unreviewed" : "Mark Reviewed"}
                                              </button>
                                              
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleUndoSubmission(user.id, sub.task_number);
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                              >
                                                <Undo2 size={16} />
                                                Undo Submission
                                              </button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
