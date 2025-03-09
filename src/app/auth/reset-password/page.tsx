"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle, CheckCircle2, Lock } from "lucide-react";
import { Label } from "@/components/shadcn/label";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Logo } from "@/components/ui/logo";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    letter: false,
    number: false,
    uppercase: false
  });

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid or missing reset token");
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/validate-token?token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Invalid or expired token");
        }

        setIsValidToken(true);
      } catch (error) {
        setError("This password reset link is invalid or has expired");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password: string) => {
    setPasswordCriteria({
      length: password.length >= 8,
      letter: /[a-z]/.test(password),
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password)
    });
  };

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate password
    const { length, letter, number, uppercase } = passwordCriteria;
    if (!length || !letter || !number || !uppercase) {
      setError("Password does not meet security requirements");
      setIsLoading(false);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to reset password");
      }

      setIsSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-8">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="relative border border-border/50 rounded-[2rem] p-4 sm:p-8 md:p-12 bg-muted/10">
          <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
            <div className="grid lg:grid-cols-2">
              <div className="relative flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20">
                <div className="w-full max-w-sm space-y-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Logo size="lg" />
                    <div className="space-y-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Reset Password</h1>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        {isSuccess 
                          ? "Your password has been reset successfully" 
                          : isValidating 
                            ? "Validating your reset link..." 
                            : isValidToken 
                              ? "Create a new password for your account" 
                              : "Invalid or expired reset link"}
                      </p>
                    </div>
                  </div>

                  {isValidating ? (
                    <div className="flex justify-center py-10">
                      <LoaderCircle className="h-10 w-10 animate-spin text-primary" />
                    </div>
                  ) : isSuccess ? (
                    <div className="py-6 text-center space-y-6">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Password Reset Complete</h2>
                        <p className="text-muted-foreground">
                          Your password has been reset successfully. You can now log in with your new password.
                        </p>
                      </div>
                      <div className="pt-4">
                        <Button
                          type="button"
                          className="w-full h-12 text-base font-medium"
                          onClick={() => router.push("/auth/login")}
                        >
                          Go to Login
                        </Button>
                      </div>
                    </div>
                  ) : isValidToken ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="rounded-md bg-destructive/10 p-4">
                          <div className="text-sm text-destructive">{error}</div>
                        </div>
                      )}
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <Label htmlFor="password" className="text-foreground font-medium">New Password</Label>
                          <Input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 text-base"
                            required
                          />
                          <div className="pt-1.5">
                            <ul className="space-y-2">
                              <li className={`flex items-center gap-2 ${passwordCriteria.length ? "text-green-500" : "text-destructive"} text-sm`}>
                                {passwordCriteria.length ? "✓" : "✗"} At least 8 characters
                              </li>
                              <li className={`flex items-center gap-2 ${passwordCriteria.letter ? "text-green-500" : "text-destructive"} text-sm`}>
                                {passwordCriteria.letter ? "✓" : "✗"} At least one lowercase letter
                              </li>
                              <li className={`flex items-center gap-2 ${passwordCriteria.uppercase ? "text-green-500" : "text-destructive"} text-sm`}>
                                {passwordCriteria.uppercase ? "✓" : "✗"} At least one uppercase letter
                              </li>
                              <li className={`flex items-center gap-2 ${passwordCriteria.number ? "text-green-500" : "text-destructive"} text-sm`}>
                                {passwordCriteria.number ? "✓" : "✗"} At least one number
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          <Label htmlFor="confirm-password" className="text-foreground font-medium">Confirm Password</Label>
                          <Input
                            type="password"
                            id="confirm-password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 text-base font-medium"
                        >
                          {isLoading ? (
                            <LoaderCircle className="animate-spin" size={20} />
                          ) : (
                            "Reset Password"
                          )}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="py-6 text-center space-y-6">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                        <Lock className="h-10 w-10 text-destructive" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Invalid Reset Link</h2>
                        <p className="text-muted-foreground">
                          The password reset link is invalid or has expired. Please request a new password reset link.
                        </p>
                      </div>
                      <div className="pt-4">
                        <Button
                          type="button"
                          className="w-full h-12 text-base font-medium"
                          onClick={() => router.push("/auth/forgot-password")}
                        >
                          Request New Link
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-1.5 text-sm">
                    <span className="text-muted-foreground">Remember your password?</span>
                    <Link href="/auth/login" className="font-medium text-primary hover:text-primary/80 transition">
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block relative h-full min-h-[650px]">
                <Image
                  src="/login-bg.jpeg"
                  alt="Login background"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1400px) 50vw, 700px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 