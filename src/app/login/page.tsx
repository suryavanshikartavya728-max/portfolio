"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = `${rollNumber.toLowerCase()}@students.iitmandi.ac.in`;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-star-accent)] opacity-5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-star-task2)] opacity-5 rounded-full blur-[120px] pointer-events-none" />
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
              STAR Portal
            </h1>
            <p className="text-xs text-muted-foreground/60 font-mono mb-2">
              (STAC Technical Assessment & Recruitment)
            </p>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
              Login to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="rollNumber"
                className="block text-sm font-medium text-muted-foreground mb-2"
              >
                Roll Number
              </label>
              <input
                id="rollNumber"
                type="text"
                placeholder="e.g. B24001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-accent)] focus:ring-1 focus:ring-[var(--color-star-accent)] outline-none transition-all text-foreground uppercase"
              />
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-[var(--color-star-border)] focus:border-[var(--color-star-accent)] focus:ring-1 focus:ring-[var(--color-star-accent)] outline-none transition-all text-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--color-star-accent)] text-background font-semibold py-3 rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Authenticating..." : "Access Portal"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            New to STAR Test?{" "}
            <Link
              href="/signup"
              className="text-[var(--color-star-accent)] hover:underline font-medium"
            >
              Initialize applicant profile
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
