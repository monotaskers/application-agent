import { PasswordlessAuthForm } from "@/features/auth/components/passwordless-auth-form";
import { GoogleOAuthButton } from "@/features/auth/components/google-oauth-button";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Sign Up - InScope",
  description: "Sign up for InScope",
};

// Local design assets (downloaded from Figma)
const backgroundImage = "/login-background.png";

/**
 * Sign-up page component
 * Uses same form as sign-in (passwordless auto-creates users)
 * Replaces Clerk SignUp with passwordless email form and Google OAuth
 *
 * @returns React element containing the sign-up page
 */
export default function SignUpViewPage(): ReactElement {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left side - Branding with background image */}
      <div className="relative hidden h-full flex-col lg:flex">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Logo and branding */}
        <div className="relative z-20 flex h-full flex-col items-center justify-center">
          {/* Logo icon */}
          <div className="mb-8 flex items-center justify-center">
            <Logo size="large" />
          </div>

          {/* InScope text */}
          <h1 className="font-sans text-center text-[61.32px] font-bold leading-none tracking-[-1.2264px] text-white">
            InScope
          </h1>
        </div>
      </div>

      {/* Right side - Sign up form */}
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <PasswordlessAuthForm />
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-sans">
                Or continue with
              </span>
            </div>
          </div>
          <GoogleOAuthButton />
          <p className="text-muted-foreground px-8 text-center text-sm font-sans">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="text-[#4B4DED] hover:text-[#3a3bc7] underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#4B4DED] hover:text-[#3a3bc7] underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
