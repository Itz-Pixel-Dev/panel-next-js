"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Logo } from "@/components/ui/logo";

export default function VerifyRequest() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "your email";

  useEffect(() => {
    // If no email is provided, redirect to the login page
    if (!searchParams.get("email")) {
      setTimeout(() => {
        router.push("/auth/login");
      }, 5000); // Redirect after 5 seconds
    }
  }, [searchParams, router]);

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
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                        Check your email
                      </h1>
                      <p className="text-muted-foreground text-base sm:text-lg">
                        A verification link has been sent to your email address
                      </p>
                    </div>
                  </div>

                  <div className="py-6 text-center space-y-6">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold">Verification email sent</h2>
                      <p className="text-muted-foreground">
                        We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
                      </p>
                      <p className="text-muted-foreground text-sm mt-2">
                        Click the link in the email to verify your account. If you don't see the email, check your spam folder.
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

                  <div className="flex justify-center gap-1.5 text-sm">
                    <span className="text-muted-foreground">Need help?</span>
                    <Link href="/support" className="font-medium text-primary hover:text-primary/80 transition">
                      Contact Support
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