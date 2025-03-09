"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoaderCircle, CheckCircle2 } from "lucide-react";
import { Label } from "@/components/shadcn/label";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Logo } from "@/components/ui/logo";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Call the API to send a password reset email
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to send reset link");
      }

      // Show success message
      setIsSuccess(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while processing your request");
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
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Forgot Password</h1>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        {isSuccess 
                          ? "Check your email for reset instructions" 
                          : "Enter your email to receive a password reset link"}
                      </p>
                    </div>
                  </div>

                  {isSuccess ? (
                    <div className="py-6 text-center space-y-6">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold">Check your inbox</h2>
                        <p className="text-muted-foreground">
                          We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>
                        </p>
                      </div>
                      <div className="pt-4">
                        <Button
                          type="button"
                          className="w-full h-12 text-base font-medium"
                          onClick={() => router.push("/auth/login")}
                        >
                          Back to Login
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="rounded-md bg-destructive/10 p-4">
                          <div className="text-sm text-destructive">{error}</div>
                        </div>
                      )}
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                          <Input
                            type="email"
                            id="email"
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            "Send Reset Link"
                          )}
                        </Button>
                      </div>
                    </form>
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