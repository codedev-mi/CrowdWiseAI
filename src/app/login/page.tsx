"use client";

import React, { useState, useEffect } from "react";
import { login } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check system preference or default to dark for this app's aesthetic
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.success) {
      toast({
        title: "Success",
        description: "Logged in successfully.",
      });
      router.push("/dashboard");
      router.refresh();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result?.error || "Something went wrong.",
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background transition-colors duration-500 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Theme Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 rounded-full bg-background/50 backdrop-blur-md border border-border/50"
      >
        {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-600" />}
      </Button>

      <Card className="w-full max-w-md border-border/50 bg-card/60 dark:bg-white/5 backdrop-blur-2xl shadow-2xl relative z-10 transition-all duration-300">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-primary/20 transform hover:scale-105 transition-transform">
            <Icons.shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">CrowdWise</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Enter your credentials to access the command center
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-foreground/80 font-medium ml-1">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="bg-background/50 border-border/50 focus:ring-primary h-11"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" title="Password" className="text-foreground/80 font-medium">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="bg-background/50 border-border/50 focus:ring-primary h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Sign In
            </Button>
            <p className="text-sm text-center text-muted-foreground/90">
              Use your registered CrowdWise credentials to access the command center.
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 w-full text-center z-10">
        <p className="text-xs text-muted-foreground/60 font-medium uppercase tracking-widest">
          Tactical Command System &copy; 2026
        </p>
      </div>
    </div>
  );
}
