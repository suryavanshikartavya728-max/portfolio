"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, LayoutDashboard, Bell, PenTool, LogOut, Loader2, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

const adminNavItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "User Submissions", icon: Users },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/overrides", label: "Overrides", icon: PenTool },
  { href: "/admin/settings", label: "System Settings", icon: ShieldAlert },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkAdminAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAuthorized(false);
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        toast.error("Unauthorized. Admin access required.");
        router.push("/dashboard");
      }
    }
    checkAdminAccess();
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-star-bg)] text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-red-500" size={32} />
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">Verifying Clearance...</p>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0c] flex flex-col md:flex-row font-syne text-foreground">
      {/* Sidebar */}
      <div className="fixed md:sticky top-0 left-0 h-screen w-64 bg-black/50 backdrop-blur-md border-r border-red-500/20 flex flex-col z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <ShieldAlert className="text-red-500" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-xl tracking-wider text-red-500">ADMIN</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
              Command Center
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                  isActive
                    ? "bg-red-500/10 text-red-400 border border-red-500/30"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-red-500/20">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-muted-foreground hover:bg-white/5 transition-all font-medium"
          >
            <LogOut size={18} className="rotate-180" />
            Exit Admin
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full relative">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full p-4 md:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
