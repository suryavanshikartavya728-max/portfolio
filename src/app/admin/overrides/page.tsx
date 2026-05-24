"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { PenTool, Save, X } from "lucide-react";

export default function AdminOverridesPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editing State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editRank, setEditRank] = useState<string>("");
  const [editScore, setEditScore] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    // Fetch profiles and left join with their task 3 leaderboard entry
    const { data } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        roll_number,
        leaderboard(overall_score, rank, is_overridden)
      `)
      .eq("role", "student")
      .order("roll_number");

    if (data) setUsers(data);
    setLoading(false);
  }

  function startEdit(user: any) {
    setEditingUserId(user.id);
    const lb = user.leaderboard?.[0];
    setEditRank(lb?.rank?.toString() || "");
    setEditScore(lb?.overall_score?.toString() || "");
  }

  async function handleSave(userId: string) {
    setIsSaving(true);
    const parsedRank = parseInt(editRank);
    const parsedScore = parseFloat(editScore);

    if (isNaN(parsedRank) || isNaN(parsedScore)) {
      toast.error("Rank and Score must be valid numbers");
      setIsSaving(false);
      return;
    }

    // Upsert the leaderboard row manually
    const { error } = await supabase
      .from("leaderboard")
      .upsert({
        user_id: userId,
        rank: parsedRank,
        overall_score: parsedScore,
        is_overridden: true
      });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Leaderboard override applied successfully");
      setEditingUserId(null);
      loadUsers();
    }
    setIsSaving(false);
  }

  async function handleRemoveOverride(userId: string) {
    if (!confirm("Are you sure you want to remove the override? Their score will be recalculated naturally next time they submit.")) return;
    
    // We can just delete their leaderboard entry so it gets rebuilt naturally
    const { error } = await supabase.from("leaderboard").delete().eq("user_id", userId);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Override removed.");
      loadUsers();
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-syne mb-2 text-foreground">Manual Overrides</h1>
        <p className="text-muted-foreground font-mono text-sm">Hardcode Task 3 Leaderboard Ranks & Scores</p>
      </div>

      <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground font-mono text-xs uppercase tracking-wider">
                <th className="pb-4 pl-4 font-bold">Roll Number</th>
                <th className="pb-4 font-bold">Name</th>
                <th className="pb-4 font-bold">Current Score</th>
                <th className="pb-4 font-bold">Current Rank</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 pr-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground animate-pulse">Loading directory...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">No students found</td>
                </tr>
              ) : (
                users.map((user) => {
                  const isEditing = editingUserId === user.id;
                  const lb = user.leaderboard?.[0];
                  
                  return (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 pl-4 font-mono text-sm">{user.roll_number}</td>
                      <td className="py-4 font-syne font-bold">{user.full_name}</td>
                      
                      {isEditing ? (
                        <>
                          <td className="py-2">
                            <input 
                              type="number" 
                              step="0.0001"
                              value={editScore} 
                              onChange={e => setEditScore(e.target.value)}
                              className="w-24 px-2 py-1 bg-black/60 border border-red-500/50 rounded outline-none font-mono text-sm text-foreground"
                            />
                          </td>
                          <td className="py-2">
                            <input 
                              type="number" 
                              value={editRank} 
                              onChange={e => setEditRank(e.target.value)}
                              className="w-20 px-2 py-1 bg-black/60 border border-red-500/50 rounded outline-none font-mono text-sm text-foreground"
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-4 font-mono text-sm text-muted-foreground">{lb?.overall_score?.toFixed(4) || "N/A"}</td>
                          <td className="py-4 font-mono text-sm text-muted-foreground">{lb?.rank ? `#${lb.rank}` : "N/A"}</td>
                        </>
                      )}

                      <td className="py-4">
                        {lb?.is_overridden ? (
                          <span className="text-xs font-mono font-bold bg-red-500/10 text-red-400 px-2 py-1 rounded">OVERRIDDEN</span>
                        ) : (
                          <span className="text-xs font-mono bg-white/5 text-muted-foreground px-2 py-1 rounded">NATURAL</span>
                        )}
                      </td>

                      <td className="py-4 pr-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => setEditingUserId(null)}
                              className="p-2 text-muted-foreground hover:bg-white/10 rounded"
                            >
                              <X size={16} />
                            </button>
                            <button 
                              onClick={() => handleSave(user.id)}
                              disabled={isSaving}
                              className="p-2 text-green-400 bg-green-500/10 hover:bg-green-500/20 rounded disabled:opacity-50"
                            >
                              <Save size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            {lb?.is_overridden && (
                              <button 
                                onClick={() => handleRemoveOverride(user.id)}
                                className="px-3 py-1 text-xs font-mono text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded"
                              >
                                CLEAR
                              </button>
                            )}
                            <button 
                              onClick={() => startEdit(user)}
                              className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded transition-colors"
                            >
                              <PenTool size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
