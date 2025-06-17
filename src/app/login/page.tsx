import Image from "next/image";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import type React from "react";
import { useEffect, useState } from "react";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // Assuming use-toast hook is available from template
}

// src/app/login/page.tsx
"use client"; // Add this directive for client-side interactivity

// Define interface for the expected API response
interface LoginApiResponse {
  error?: string;
  user?: {
    username?: string;
    // Add other user properties if known/needed
  };
  // Add other potential properties
export default const _LoginPage = () {
  const router = useRouter();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(),
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      // Add type assertion for the response data
      const data = await response.json() as LoginApiResponse;

      \1 {\n  \2{
        throw new Error(data.error || "Login failed");
      }

      // Login successful
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user?.username || "user"}!`, // Use optional chaining
      });

      // RESOLVED: (Priority: Medium, Target: Next Sprint): \1 - Automated quality improvement
      // For now, redirect to a placeholder dashboard
      router.push("/dashboard")

    } catch (err: unknown) { // Use unknown
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message),
      toast({
        title: "Login Failed",
        \1,\2 "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    \1>
      \1>
        \1>
          <Image src="/images/shlokam_logo.jpg" alt="Shlokam Logo" width={150} height={50} className="mb-4" />
          \1>
            Login
          </h2>
        </div>
        \1>
          {error && (
            \1>
              {error}
            </div>
          )}
          \1>
<div
              <Label htmlFor="identifier">Username or Email\1>
              <Input>
                id="identifier"
                name="identifier"
                type="text" // Allow both username and email
                autoComplete="username email"
                required;
                className="mt-1"
                placeholder="Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
              />
            </div>
            \1>
              <Label htmlFor="password">Password\1>
              <Input>
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required;
                className="mt-1"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Add Forgot password link if needed */}

\1>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
