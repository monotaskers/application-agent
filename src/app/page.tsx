import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Root page component
 * Redirects authenticated users to admin, unauthenticated users to sign-in
 *
 * @returns Never (always redirects)
 */
export default async function Page(): Promise<never> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/sign-in");
  }

  redirect("/admin/overview");
}
