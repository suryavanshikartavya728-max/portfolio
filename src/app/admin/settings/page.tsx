"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Save, Clock } from "lucide-react";

export default function AdminSettingsPage() {
  const [deadline, setDeadline] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase
        .from("site_settings")
        .select("deadline")
        .eq("id", 1)
        .single();
        
      if (data && data.deadline) {
        // Convert to local datetime-local string format
        const dateObj = new Date(data.deadline);
        const tzoffset = dateObj.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = (new Date(dateObj.getTime() - tzoffset)).toISOString().slice(0, 16);
        setDeadline(localISOTime);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    // Convert back to UTC string for the database
    const utcDate = new Date(deadline).toISOString();

    const { error } = await supabase
      .from("site_settings")
      .upsert({ id: 1, deadline: utcDate });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Global deadline updated successfully!");
    }
    setIsSaving(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-syne mb-2 text-foreground">System Settings</h1>
        <p className="text-muted-foreground font-mono text-sm">Global configurations and locks</p>
      </div>

      <div className="bg-black/40 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-lg font-bold font-syne mb-6 flex items-center gap-2">
          <Clock size={20} className="text-red-400" />
          Submission Deadline
        </h2>
        
        {loading ? (
          <div className="h-12 bg-white/5 rounded animate-pulse w-1/2" />
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Global Cutoff Time
              </label>
              <input 
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full md:w-1/2 px-4 py-3 rounded-lg bg-black/60 border border-red-500/20 text-foreground outline-none focus:border-red-500/50 font-mono"
              />
              <p className="text-xs text-muted-foreground mt-2 max-w-xl">
                When this deadline passes, the dashboard countdown will hit zero. All task submission forms will automatically lock, and the database trigger will reject any API requests to bypass it.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? "Saving..." : "Update Deadline"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
