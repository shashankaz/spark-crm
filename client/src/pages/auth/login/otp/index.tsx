import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import toast from "react-hot-toast";

import { quotes } from "@/data/quotes";

import { useResendOtp } from "@/hooks";

import { OTPForm } from "./otp-form";

const RESEND_COOLDOWN = 60;
export const OTP_SESSION_KEY = "otp_pending";

const OTPPage = () => {
  const location = useLocation();

  const [{ userId, email }] = useState<{
    userId?: string;
    email?: string;
  }>(() => {
    const fromState = {
      userId: location.state?.userId as string | undefined,
      email: location.state?.email as string | undefined,
    };

    if (fromState.userId) {
      sessionStorage.setItem(OTP_SESSION_KEY, JSON.stringify(fromState));
      return fromState;
    }

    const saved = sessionStorage.getItem(OTP_SESSION_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as { userId?: string; email?: string };
      } catch {
        return {};
      }
    }

    return {};
  });

  const [cooldown, setCooldown] = useState(0);
  const { mutate: resendOtpMutate, isPending: isResending } = useResendOtp();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = () => {
    if (!userId || cooldown > 0 || isResending) return;

    resendOtpMutate(
      { userId },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setCooldown(RESEND_COOLDOWN);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  const quote = quotes[0];
  const year = new Date().getFullYear();

  if (!userId) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen grid md:grid-cols-[1fr_1fr] lg:grid-cols-[5fr_7fr] select-none">
      <div className="hidden md:flex flex-col justify-between bg-primary p-12">
        <Link
          to="/"
          className="text-2xl text-primary-foreground font-playfair-display font-medium"
        >
          Spark
        </Link>

        <div>
          <blockquote className="text-3xl font-playfair-display leading-snug text-primary-foreground/90 mb-6">
            <em>&ldquo;{quote.text}&rdquo;</em>
          </blockquote>
          <p className="text-sm font-space-mono text-primary-foreground/60">
            {quote.author}
          </p>
        </div>

        <p className="text-xs font-space-mono text-primary-foreground/40">
          &copy; {year} Spark
        </p>
      </div>

      <div className="flex flex-col justify-center items-center bg-background px-8 py-16">
        <Link
          to="/"
          className="md:hidden text-2xl text-foreground mb-12 font-playfair-display font-medium"
        >
          Spark
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3 font-space-mono">
              Two-factor authentication
            </p>
            <h1 className="text-4xl text-foreground font-playfair-display">
              Enter OTP
            </h1>
            {email && (
              <p className="text-sm text-muted-foreground mt-3">
                We sent a 6-digit code to{" "}
                <span className="text-foreground font-medium">{email}</span>
              </p>
            )}
          </div>

          <OTPForm userId={userId} />

          <p className="text-sm text-muted-foreground text-center mt-6">
            Didn&apos;t receive a code?{" "}
            <button
              type="button"
              disabled={cooldown > 0 || isResending}
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
              onClick={handleResend}
            >
              {isResending
                ? "Sending..."
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend"}
            </button>
          </p>

          <p className="text-sm text-muted-foreground text-center mt-3">
            <Link
              to="/login"
              replace
              onClick={() => sessionStorage.removeItem(OTP_SESSION_KEY)}
              className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
