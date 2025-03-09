"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { Label } from "@/components/shadcn/label";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { useTheme } from "next-themes";
import { Logo } from "@/components/ui/logo";
import { signIn } from "next-auth/react";

export default function Signup() {
  const router = useRouter();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    letter: false,
    number: false,
    uppercase: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const validatePassword = (password: string) => {
    setPasswordCriteria({
      length: password.length >= 8,
      letter: /[a-z]/.test(password),
      number: /\d/.test(password),
      uppercase: /[A-Z]/.test(password)
    });
  };

  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate password matching
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const { length, letter, number, uppercase } = passwordCriteria;
    if (!length || !letter || !number || !uppercase) {
      setError("Password does not meet security requirements");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create account");
      }

      // Redirect to login page on successful registration
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during registration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleDiscordSignIn = () => {
    signIn("discord", { callbackUrl: "/dashboard" });
  };

  if (!mounted) return null;

  return (
    <section className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-8">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="relative border border-border/50 rounded-[2rem] p-4 sm:p-8 md:p-12 bg-muted/10">
          <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
            <div className="grid lg:grid-cols-2">
              <div className="relative flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20">
                <div className="w-full max-w-sm space-y-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Logo />
                    <div className="space-y-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Create an account</h1>
                      <p className="text-muted-foreground text-base sm:text-lg">Please enter your details below.</p>
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
                        <Label htmlFor="name" className="text-foreground font-medium">Username</Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="example"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="h-12 text-base"
                          required
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="example@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="h-12 text-base"
                          required
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          className="h-12 text-base"
                          required
                        />
                        {(isFocused || formData.password) && (
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
                        )}
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
                        <Input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="h-12 text-base"
                          required
                        />
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <p className="text-destructive text-sm mt-1">Passwords do not match</p>
                        )}
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
                          "Sign up"
                        )}
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-muted-foreground/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-3 text-muted-foreground">
                            Or continue with
                          </span>
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
                    <span className="text-muted-foreground">Already have an account?{" "}</span>
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