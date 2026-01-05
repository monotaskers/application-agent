import { OtpVerificationForm } from "@/features/auth/components/otp-verification-form";
import { Logo } from "@/components/logo";
import { Metadata } from "next";
import Image from "next/image";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Verify Code - AppName",
  description: "Enter your verification code",
};

interface VerifyOtpPageProps {
  searchParams: Promise<{ email?: string }>;
}

/**
 * OTP verification page
 * Displays form for users to enter 6-digit code from email
 *
 * @param props - Page props
 * @param props.searchParams - URL search parameters containing email (async in Next.js 15)
 * @returns Promise resolving to React element containing the OTP verification page
 */
export default async function VerifyOtpPage({
  searchParams,
}: VerifyOtpPageProps): Promise<ReactElement> {
  const params = await searchParams;
  const email = params.email;

  if (!email) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground font-sans">Email required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left side - Branding with background image */}
      <div className="relative hidden h-full flex-col lg:flex">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/login-background.png"
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

          {/* AppName text */}
          <h1 className="font-sans text-center text-[61.32px] font-bold leading-none tracking-[-1.2264px] text-white">
            AppName
          </h1>
        </div>
      </div>

      {/* Right side - OTP verification form */}
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <OtpVerificationForm email={email} />
        </div>
      </div>
    </div>
  );
}
