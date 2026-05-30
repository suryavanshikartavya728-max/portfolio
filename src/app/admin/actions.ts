"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create a Supabase client with the Service Role key to bypass RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function toggleUserDisqualification(userId: string, currentStatus: boolean) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ is_disqualified: !currentStatus })
    .eq("id", userId);

  if (error) {
    console.error("Disqualification error:", error);
    throw new Error(error.message);
  }

  // Revalidate relevant paths so the UI updates if using SSR
  revalidatePath("/admin/users");
  revalidatePath("/admin/leaderboard");
  revalidatePath("/dashboard/results");
  revalidatePath("/dashboard/task-3/leaderboard");

  return { success: true, newStatus: !currentStatus };
}
