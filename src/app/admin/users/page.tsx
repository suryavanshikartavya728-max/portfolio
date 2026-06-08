"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Search, Loader2, Undo2, Check, RefreshCw, ChevronDown, ChevronUp, Code, Globe, FileText, Activity, AlertTriangle, ShieldAlert, Award, X, Save } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { toggleUserDisqualification, toggleUserClubMember } from "../actions";

export default function UserSubmissionsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  // Role and ID of current user
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Scoring parameter names from DB
  const [scoringParams, setScoringParams] = useState<any[]>([]);

  // Evaluation Modal State
  const [activeSubmission, setActiveSubmission] = useState<any>(null);
  const [activeUser, setActiveUser] = useState<any>(null);
  const [score1, setScore1] = useState("0");
  const [score2, setScore2] = useState("0");
  const [score3, setScore3] = useState("0");
  const [remarks, setRemarks] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [isSavingEval, setIsSavingEval] = useState(false);

  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    
    // Fetch profiles, nested submissions and evaluations
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        roll_number,
        is_disqualified,
        is_club_member,
        task_statuses ( task_number, status ),
        submissions ( 
          *,
          evaluations ( * )
        )
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

    // Fetch scoring parameters
    const { data: paramsData } = await supabase
      .from("scoring_parameters")
      .select("*");
      
    if (paramsData) {
      setScoringParams(paramsData);
    }

    setLoading(false);
  };

  useEffect(() => {
    async function loadCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        if (data) setCurrentUserRole(data.role);
      }
    }
    loadCurrentUser();
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

  // Rename handleMarkReviewed to handleEvaluateClick and incorporate Lockout rules
  const handleEvaluateClick = (user: any, sub: any) => {
    const existingEval = Array.isArray(sub.evaluations) ? sub.evaluations[0] : sub.evaluations;
    
    if (existingEval) {
      // Locking rules: Once score is submitted, evaluators cannot edit it
      if (currentUserRole === "evaluator") {
        toast.error("Only admins can edit the score and mark it to reevaluate. Please ask to admin.");
        return;
      }
    }

    // Allow Admin or Evaluator (for brand new evaluations) to edit
    setActiveSubmission(sub);
    setActiveUser(user);
    setScore1(existingEval?.score_1?.toString() || "0");
    setScore2(existingEval?.score_2?.toString() || "0");
    setScore3(existingEval?.score_3?.toString() || "0");
    setRemarks(existingEval?.remarks || "");
    setIsInvalid(!!existingEval?.is_invalid);
    setShowEvalModal(true);
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmission) return;

    setIsSavingEval(true);

    try {
      const s1 = parseFloat(score1) || 0;
      const s2 = parseFloat(score2) || 0;
      const s3 = parseFloat(score3) || 0;

      const existingEval = Array.isArray(activeSubmission.evaluations) ? activeSubmission.evaluations[0] : activeSubmission.evaluations;

      // Upsert the evaluation row
      const evalData: any = {
        submission_id: activeSubmission.id,
        evaluator_id: currentUserId,
        score_1: s1,
        score_2: s2,
        score_3: s3,
        remarks: remarks,
        is_invalid: isInvalid,
        evaluated_at: new Date().toISOString()
      };
      if (existingEval?.id) evalData.id = existingEval.id;

      const { error: evalError } = await supabase
        .from("evaluations")
        .upsert(evalData, { onConflict: 'submission_id' });

      if (evalError) throw evalError;

      // Update submissions table: mark is_reviewed as true, status as 'reviewed' (or 'invalid')
      const { error: subError } = await supabase
        .from("submissions")
        .update({
          is_reviewed: true,
          status: isInvalid ? "invalid" : "submitted"
        })
        .eq("id", activeSubmission.id);

      if (subError) throw subError;

      toast.success("Evaluation saved successfully!");
      setShowEvalModal(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "An error occurred during evaluation save");
      console.error(err);
    } finally {
      setIsSavingEval(false);
    }
  };

  const handleToggleDisqualify = async (e: React.MouseEvent, user: any) => {
    e.stopPropagation();
    if (currentUserRole !== "admin") {
      toast.error("Only admins possess disqualify permissions.");
      return;
    }

    const confirmMsg = user.is_disqualified
      ? `Are you sure you want to Undo Disqualification for ${user.full_name}?`
      : `Are you sure you want to DISQUALIFY ${user.full_name}? They will be completely blocked from making submissions, and marked on all leaderboards.`;

    if (!confirm(confirmMsg)) return;

    try {
      await toggleUserDisqualification(user.id, user.is_disqualified);

      toast.success(user.is_disqualified ? "Applicant disqualification undone successfully!" : "Applicant DISQUALIFIED successfully!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update disqualification status");
    }
  };

  const handleToggleClubMember = async (e: React.MouseEvent, user: any) => {
    e.stopPropagation();
    if (currentUserRole !== "admin") {
      toast.error("Only admins possess club member permissions.");
      return;
    }

    const confirmMsg = user.is_club_member
      ? `Are you sure you want to remove ${user.full_name} from Club Members?`
      : `Are you sure you want to mark ${user.full_name} as a Club Member?`;

    if (!confirm(confirmMsg)) return;

    try {
      await toggleUserClubMember(user.id, user.is_club_member);

      toast.success(user.is_club_member ? "Removed from Club Members successfully!" : "Applicant marked as Club Member successfully!");
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update club member status");
    }
  };

  const handleUndoSubmission = async (userId: string, taskNumber: number) => {
    if (currentUserRole !== "admin") {
      toast.error("Only admins can undo submissions.");
      return;
    }

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

  const getParamTitles = (taskNumber: number) => {
    const match = scoringParams.find(p => p.task_number === taskNumber);
    return {
      p1: match?.param_1_title || "Score 1",
      p2: match?.param_2_title || "Score 2",
      p3: match?.param_3_title || "Score 3"
    };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-syne mb-2 text-foreground">User Submissions</h1>
          <p className="text-muted-foreground font-mono text-sm">Review, evaluate, and manage applicant profiles</p>
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
          {["all", 1, 2, 3, 4].map((f) => (
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
                  <th className="p-4 font-medium text-center">Status / Clearance</th>
                  <th className="p-4 font-medium text-center">Tasks Completed</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
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
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground font-syne">{user.full_name}</span>
                              {user.is_disqualified && (
                                <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-red-500/20 text-red-500 border border-red-500/30 uppercase tracking-widest font-mono">
                                  Disqualified
                                </span>
                              )}
                              {user.is_club_member && (
                                <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-blue-500/20 text-blue-500 border border-blue-500/30 uppercase tracking-widest font-mono">
                                  Club Member
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">{user.roll_number}</div>
                          </td>
                          <td className="p-4 text-center">
                            {currentUserRole === "admin" ? (
                              <div className="flex flex-col gap-2 items-center">
                                <button
                                  onClick={(e) => handleToggleDisqualify(e, user)}
                                  className={`w-full px-3 py-1.5 text-xs font-bold font-mono rounded-lg transition-all border ${
                                    user.is_disqualified
                                      ? "bg-green-500/15 border-green-500/30 text-green-400 hover:bg-green-500/25"
                                      : "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/25"
                                  }`}
                                >
                                  {user.is_disqualified ? "UNDO DISQUALIFICATION" : "DISQUALIFY"}
                                </button>
                                <button
                                  onClick={(e) => handleToggleClubMember(e, user)}
                                  className={`w-full px-3 py-1.5 text-xs font-bold font-mono rounded-lg transition-all border ${
                                    user.is_club_member
                                      ? "bg-gray-500/15 border-gray-500/30 text-gray-400 hover:bg-gray-500/25"
                                      : "bg-blue-500/15 border-blue-500/30 text-blue-400 hover:bg-blue-500/25"
                                  }`}
                                >
                                  {user.is_club_member ? "REMOVE CLUB MEMBER" : "MAKE CLUB MEMBER"}
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs font-mono text-muted-foreground">
                                {user.is_disqualified ? "Locked out" : "Active"}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-mono font-bold ${
                                completedCount === 4
                                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                  : completedCount > 0
                                  ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                  : "bg-white/5 text-muted-foreground border border-white/10"
                              }`}
                            >
                              {completedCount} / 4
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
                              <td colSpan={4} className="p-0 border-b border-red-500/20">
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
                                        {user.submissions.map((sub: any) => {
                                          const evaluation = Array.isArray(sub.evaluations) ? sub.evaluations[0] : sub.evaluations;
                                          const titles = getParamTitles(sub.task_number);

                                          return (
                                            <div
                                              key={sub.id}
                                              className="bg-[#0a0a0c] border border-red-500/20 rounded-xl p-5 shadow-lg relative flex flex-col justify-between"
                                            >
                                              <div>
                                                <div className="flex justify-between items-start mb-4">
                                                  <div>
                                                    <h4 className="font-bold text-red-400 font-syne text-lg">
                                                      Task {sub.task_number}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground font-mono mt-1">
                                                      Submitted: {new Date(sub.submitted_at).toLocaleString()}
                                                    </p>
                                                  </div>
                                                  <div className="flex flex-col items-end gap-1.5">
                                                    <span
                                                      className={`px-2.5 py-1 text-xs rounded-md font-mono font-bold uppercase tracking-wider ${
                                                        evaluation
                                                          ? evaluation.is_invalid
                                                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                                            : "bg-green-500/10 text-green-500 border border-green-500/20"
                                                          : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                                      }`}
                                                    >
                                                      {evaluation
                                                        ? evaluation.is_invalid
                                                          ? "Invalidated"
                                                          : "Evaluated"
                                                        : "Pending Review"}
                                                    </span>
                                                  </div>
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

                                                {/* Display Evaluated Metrics if present */}
                                                {evaluation && (
                                                  <div className="mb-6 p-4 bg-red-500/5 rounded-xl border border-red-500/10 space-y-3">
                                                    <h5 className="text-xs font-mono font-bold uppercase tracking-widest text-red-400">Scorecard:</h5>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                      <div className="flex flex-col relative group cursor-help">
                                                        <span className="text-[10px] text-muted-foreground uppercase font-mono truncate">{titles.p1}</span>
                                                        <div className="absolute bottom-full mb-1 left-0 bg-[var(--color-star-surface)] border border-[var(--color-star-border)] text-xs text-foreground p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                                          {titles.p1}
                                                        </div>
                                                        <strong className="font-mono text-sm mt-1">{evaluation.score_1}</strong>
                                                      </div>
                                                      <div className="flex flex-col relative group cursor-help">
                                                        <span className="text-[10px] text-muted-foreground uppercase font-mono truncate">{titles.p2}</span>
                                                        <div className="absolute bottom-full mb-1 left-0 bg-[var(--color-star-surface)] border border-[var(--color-star-border)] text-xs text-foreground p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                                          {titles.p2}
                                                        </div>
                                                        <strong className="font-mono text-sm mt-1">{evaluation.score_2}</strong>
                                                      </div>
                                                      <div className="flex flex-col relative group cursor-help">
                                                        <span className="text-[10px] text-muted-foreground uppercase font-mono truncate">{titles.p3}</span>
                                                        <div className="absolute bottom-full mb-1 left-0 bg-[var(--color-star-surface)] border border-[var(--color-star-border)] text-xs text-foreground p-2 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl pointer-events-none">
                                                          {titles.p3}
                                                        </div>
                                                        <strong className="font-mono text-sm mt-1">{evaluation.score_3}</strong>
                                                      </div>
                                                    </div>
                                                    <div className="border-t border-white/5 pt-2 flex justify-between items-center text-xs font-mono">
                                                      <span className="text-muted-foreground">Aggregated Total Score:</span>
                                                      <strong className="text-red-400 text-sm font-bold">{evaluation.total_score}</strong>
                                                    </div>
                                                  </div>
                                                )}
                                              </div>

                                              <div className="flex flex-wrap gap-2 pt-4 border-t border-red-500/20">
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEvaluateClick(user, sub);
                                                  }}
                                                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                    evaluation
                                                      ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30"
                                                      : "bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20"
                                                  }`}
                                                >
                                                  {evaluation ? <Check size={16} /> : <Award size={16} />}
                                                  {evaluation ? "Edit Score" : "Evaluate"}
                                                </button>
                                                
                                                {currentUserRole === "admin" && (
                                                  <button
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleUndoSubmission(user.id, sub.task_number);
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                                  >
                                                    <Undo2 size={16} />
                                                    Undo
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
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

      {/* Modern Sliding Overlay / Modal for Evaluation */}
      <AnimatePresence>
        {showEvalModal && activeSubmission && activeUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-[#0e0e11] border border-red-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowEvalModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>

              <div className="mb-6">
                <h3 className="text-xl font-bold font-syne text-foreground flex items-center gap-2">
                  <Award className="text-red-500" size={24} />
                  Evaluate Submission
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Applicant: {activeUser.full_name} ({activeUser.roll_number}) | Task {activeSubmission.task_number}
                </p>
              </div>

              <form onSubmit={handleSaveEvaluation} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase text-xs tracking-wider">
                      {getParamTitles(activeSubmission.task_number).p1} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      disabled={isInvalid}
                      value={score1}
                      onChange={(e) => setScore1(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-foreground outline-none focus:border-red-500/50 transition-colors font-mono disabled:opacity-30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase text-xs tracking-wider">
                      {getParamTitles(activeSubmission.task_number).p2} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      disabled={isInvalid}
                      value={score2}
                      onChange={(e) => setScore2(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-foreground outline-none focus:border-red-500/50 transition-colors font-mono disabled:opacity-30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase text-xs tracking-wider">
                      {getParamTitles(activeSubmission.task_number).p3} *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      disabled={isInvalid}
                      value={score3}
                      onChange={(e) => setScore3(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-foreground outline-none focus:border-red-500/50 transition-colors font-mono disabled:opacity-30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2 font-mono uppercase text-xs tracking-wider">
                      Remarks (Optional)
                    </label>
                    <textarea
                      disabled={isInvalid}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add an evaluation message..."
                      className="w-full px-4 py-3 rounded-lg bg-black border border-white/10 text-foreground outline-none focus:border-red-500/50 transition-colors font-mono disabled:opacity-30 min-h-[80px]"
                    />
                  </div>

                  {/* Invalid Option Toggle */}
                  <div className="border-t border-white/5 pt-4 mt-6">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-red-500 font-syne flex items-center gap-1.5">
                          <AlertTriangle size={16} />
                          Invalidate Submission
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          Flag this submission as fraudulent or corrupted. Scores will reset.
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        checked={isInvalid}
                        onChange={(e) => {
                          setIsInvalid(e.target.checked);
                          if (e.target.checked) {
                            setScore1("0");
                            setScore2("0");
                            setScore3("0");
                          }
                        }}
                        className="w-5 h-5 accent-red-500 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowEvalModal(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 text-muted-foreground hover:text-foreground font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEval}
                    className="px-6 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingEval ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Evaluation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
