"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link"
import { LoaderCircle } from "lucide-react";
import { Label } from "@/components/shadcn/label";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { useAuth } from "@/lib/store/auth-store";
import { Logo } from "@/components/ui/logo"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const { data: session, status } = useSession();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAuth((state) => state.setUser)

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.replace('/dashboard')
    }
  }, [status, router]);

  // Handle authenticated session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      try {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name
        });
        
        // Ensure redirect happens
        router.replace('/dashboard');
      } catch (err) {
        console.error("Session handling error:", err);
        setError("Failed to process session. Please try again.");
      }
    }
  }, [session, status, setUser, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username/email or password");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Explicitly redirect on success
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { 
        callbackUrl: "/dashboard",
        redirect: true
      });
    } catch (err) {
      console.error("Google sign in error:", err);
      setError("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  const handleDiscordSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("discord", { 
        callbackUrl: "/dashboard",
        redirect: true
      });
    } catch (err) {
      console.error("Discord sign in error:", err);
      setError("Failed to sign in with Discord. Please try again.");
      setIsLoading(false);
    }
  };

  // Show loading state only during initial session check
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoaderCircle className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning>
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
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Welcome to AirLink</h1>
                        <p className="text-muted-foreground text-base sm:text-lg">Please enter your credentials to continue.</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="rounded-md bg-destructive/10 p-4">
                          <div className="text-sm text-destructive">{error}</div>
                        </div>
                      )}
                      <div className="space-y-5">
                        <div className="space-y-2.5">
                          <Label htmlFor="identifier" className="text-foreground font-medium">Username or Email</Label>
                          <Input
                            type="text"
                            id="identifier"
                            placeholder="example@email.com or username"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="h-12 text-base"
                            required
                          />
                        </div>
                        <div className="space-y-2.5">
                          <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                          <Input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 text-base"
                            required
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="remember" className="border-muted-foreground/50" />
                            <Label htmlFor="remember" className="text-muted-foreground text-sm font-medium">Remember me</Label>
                          </div>
                          <Link 
                            href="/auth/forgot-password" 
                            className="text-sm font-medium text-primary hover:text-primary/80 transition"
                          >
                            Forgot password?
                          </Link>
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
                            "Sign in"
                          )}
                        </Button>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted-foreground/20" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleSignIn}
                            className="h-12 font-medium"
                          >
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              version="1.1"
                              x="0px"
                              y="0px"
                              viewBox="0 0 48 48"
                              enableBackground="new 0 0 48 48"
                              className="mr-2 size-5"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill="#FFC107"
                                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
                                c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                                c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                              />
                              <path
                                fill="#FF3D00"
                                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                                C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                              />
                              <path
                                fill="#4CAF50"
                                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
                                c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                              />
                              <path
                                fill="#1976D2"
                                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
                                c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                              />
                            </svg>
                            Google
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleDiscordSignIn}
                            className="h-12 font-medium"
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 127.14 96.36" 
                              className="mr-2 size-5"
                              fill="#5865F2"
                            >
                              <g>
                                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                              </g>
                            </svg>
                            Discord
                          </Button>
                        </div>
                      </div>
                    </form>

                    <div className="flex justify-center gap-1.5 text-sm">
                      <span className="text-muted-foreground">Don&apos;t have an account?</span>
                      <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/80 transition">
                        Sign up
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
    </div>
  );
}
