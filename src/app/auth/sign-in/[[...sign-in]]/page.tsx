import { PasswordlessAuthForm } from "@/features/auth/components/passwordless-auth-form";
import { GoogleOAuthButton } from "@/features/auth/components/google-oauth-button";
import { AuthErrorMessage } from "@/features/auth/components/auth-error-message";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Image from "next/image";
import type { ReactElement } from "react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In - InScope",
  description: "Sign in to InScope",
};

// Local design assets (downloaded from Figma)
const backgroundImage = "/login-background.png";

/**
 * Sign-in page component
 * Replaces Clerk SignIn with passwordless email form and Google OAuth
 *
 * @returns React element containing the sign-in page
 */
export default function SignInViewPage(): ReactElement {
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

      {/* Right side - Sign in form */}
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <Suspense fallback={null}>
            <AuthErrorMessage />
          </Suspense>

          <PasswordlessAuthForm />

          <GoogleOAuthButton />
        </div>
      </div>
    </div>
  );
}
