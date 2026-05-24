"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Settings, Save, User } from "lucide-react";
import { validateRollNumber, validateFullName } from "@/lib/validations";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setEmail(user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, roll_number")
        .eq("id", user.id)
        .single();
        
      if (profile) {
        setFullName(profile.full_name || "");
        setRollNumber(profile.roll_number || "");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFullName(fullName)) {
      toast.error("Full Name must be at least 3 characters.");
      return;
    }
    
    if (!validateRollNumber(rollNumber)) {
      toast.error("Invalid Roll Number. Must be B24XXX or B25XXX (001-600).");
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          roll_number: rollNumber.toUpperCase()
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const rollIsValid = rollNumber.length > 0 ? validateRollNumber(rollNumber) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl p-6 md:p-10 shadow-xl">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[var(--color-star-border)]">
          <div className="p-4 bg-[var(--color-star-accent)]/10 rounded-2xl text-[var(--color-star-accent)]">
            <Settings size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-syne mb-2">Account Settings</h1>
            <p className="text-muted-foreground font-mono text-sm">Manage your applicant profile</p>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-[var(--color-star-surface2)] rounded-lg" />
            <div className="h-12 bg-[var(--color-star-surface2)] rounded-lg" />
            <div className="h-12 bg-[var(--color-star-surface2)] rounded-lg" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <User size={16} /> Email Address
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-3 rounded-lg bg-background/50 border border-[var(--color-star-border)] text-muted-foreground cursor-not-allowed font-mono"
              />
              <p className="text-xs text-muted-foreground mt-2">Email address cannot be changed once initialized.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-accent)] focus:ring-1 focus:ring-[var(--color-star-accent)] outline-none transition-all text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex justify-between">
                <span>Roll Number</span>
                {rollIsValid === true && <span className="text-[var(--color-star-success)] text-xs flex items-center">Valid Format</span>}
                {rollIsValid === false && <span className="text-[var(--color-star-danger)] text-xs flex items-center">Invalid Format</span>}
              </label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                className={`w-full px-4 py-3 rounded-lg bg-background border outline-none transition-all text-foreground uppercase font-mono ${
                  rollIsValid === false 
                    ? "border-[var(--color-star-danger)] focus:ring-[var(--color-star-danger)]" 
                    : "border-[var(--color-star-border)] focus:border-[var(--color-star-accent)] focus:ring-1 focus:ring-[var(--color-star-accent)]"
                }`}
              />
            </div>

            <div className="pt-6 border-t border-[var(--color-star-border)]">
              <button
                type="submit"
                disabled={saving || rollIsValid === false}
                className="bg-[var(--color-star-accent)] text-background font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
