"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { validateRollNumber, validatePassword, validateFullName } from "@/lib/validations";
import Link from "next/link";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFullName(fullName)) {
      toast.error("Full Name must be at least 3 characters.");
      return;
    }
    if (!validateRollNumber(rollNumber)) {
      toast.error("Invalid Roll Number. Must start with B, D, M, T, or S followed by 22XXX to 25XXX (001-600).");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const email = `${rollNumber.toLowerCase()}@students.iitmandi.ac.in`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            roll_number: rollNumber.toUpperCase(),
          },
          emailRedirectTo: "https://star-test-stac.vercel.app/login"
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Profile created successfully!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during signup.");
    } finally {
      setIsLoading(false);
    }
  };

  const rollIsValid = rollNumber.length > 0 ? validateRollNumber(rollNumber) : null;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--color-star-task3)] opacity-5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--color-star-accent)] opacity-5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[var(--color-star-surface)] border border-[var(--color-star-border)] rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Join STAR
            </h1>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest mb-1">
              Initialize Applicant Profile
            </p>
            <p className="text-xs text-muted-foreground/60 font-mono">
              (STAC Technical Assessment & Recruitment)
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-accent)] focus:ring-1 focus:ring-[var(--color-star-accent)] outline-none transition-all text-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm font-medium text-muted-foreground mb-2 flex justify-between"
              >
                <span>Roll Number</span>
                {rollIsValid === true && <span className="text-[var(--color-star-success)]">Valid Format</span>}
                {rollIsValid === false && <span className="text-[var(--color-star-danger)]">Invalid Format</span>}
              </label>
              <input
                id="rollNumber"
                type="text"
                placeholder="e.g. B24001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                required
                className={`w-full px-4 py-3 rounded-lg bg-background border outline-none transition-all text-foreground uppercase ${
                  rollIsValid === false 
                    ? "border-[var(--color-star-danger)] focus:ring-[var(--color-star-danger)]" 
                    : "border-[var(--color-star-border)] focus:border-[var(--color-star-accent)] focus:ring-1 focus:ring-[var(--color-star-accent)]"
                }`}
              />
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Format: [B,D,M,T,S]22XXX to [B,D,M,T,S]25XXX (001-600)
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-accent)] focus:ring-1 focus:ring-[var(--color-star-accent)] outline-none transition-all text-foreground"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-accent)] focus:ring-1 focus:ring-[var(--color-star-accent)] outline-none transition-all text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || rollIsValid === false}
              className="w-full bg-[var(--color-star-accent)] text-background font-semibold py-3 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Creating Profile..." : "Initialize Profile"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link
              href="/login"
              className="text-[var(--color-star-accent)] hover:underline font-medium"
            >
              Access Portal
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
