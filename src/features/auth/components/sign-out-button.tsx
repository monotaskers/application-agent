"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

/**
 * Sign-out button component
 * Replaces Clerk's SignOutButton with Supabase auth sign-out
 *
 * @returns React element containing the sign-out button
 */
export function SignOutButton(): React.JSX.Element {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async (): Promise<void> => {
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
    router.refresh();
  };

  return (
    <Button variant="ghost" onClick={handleSignOut} className="font-sans">
      Sign Out
    </Button>
  );
}
