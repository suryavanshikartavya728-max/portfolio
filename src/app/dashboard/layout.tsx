"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Home, BarChart2, BookOpen, Menu, X, Rocket, Settings, ShieldAlert, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/results", label: "Results", icon: Trophy },
  { href: "/dashboard/compare", label: "Compare", icon: BarChart2 },
  { href: "/dashboard/rulebook", label: "Rulebook", icon: BookOpen },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  React.useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data?.role === 'admin' || data?.role === 'evaluator') {
        setUserRole(data.role);
      }
    }
    checkRole();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-star-bg)] flex flex-col md:flex-row font-syne">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--color-star-surface)] border-b border-[var(--color-star-border)] sticky top-0 z-50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Rocket className="text-[var(--color-star-accent)]" size={24} />
          <span className="font-bold text-lg tracking-wider">STAR</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[var(--color-star-surface)] border-r border-[var(--color-star-border)] flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 hidden md:flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-star-accent)]/10 flex items-center justify-center">
            <Rocket className="text-[var(--color-star-accent)]" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-xl tracking-wider">STAR</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono leading-tight mt-1">
              STAR Test
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 md:py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive
                    ? "bg-[var(--color-star-accent)]/10 text-[var(--color-star-accent)]"
                    : "text-muted-foreground hover:bg-[var(--color-star-surface2)] hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}

          {userRole && (
            <div className="pt-4 mt-4 border-t border-[var(--color-star-border)]">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 border border-red-500/20"
              >
                <ShieldAlert size={18} />
                Admin Center
              </Link>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-[var(--color-star-border)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-all font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-full max-w-2xl h-[500px] bg-[var(--color-star-task2)] opacity-[0.03] rounded-full blur-[150px] pointer-events-none -z-10" />
        
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="h-full p-4 md:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
