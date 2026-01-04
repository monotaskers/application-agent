import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Admin page component
 * Redirects all authenticated users to overview
 * Redirects unauthenticated users to sign-in
 *
 * @returns Never (always redirects)
 */
export default async function AdminPage(): Promise<never> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  // All authenticated users can access admin area during development
  return redirect("/admin/overview");
}
