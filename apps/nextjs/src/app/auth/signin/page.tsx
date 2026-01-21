"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "~/auth/client";
import * as Label from "@radix-ui/react-label";
import { toast } from "sonner";
import { cn } from "~/lib/utils";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabaseClient.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Check your email for the magic link!");
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8">
        <div>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to receive a magic link
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <Label.Root htmlFor="email" className="text-sm font-medium">
              Email
            </Label.Root>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className={cn(
                "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              )}
            />
          </div>

          <button
            type="submit"
            className={cn(
              "mt-4 w-full inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            )}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send magic link"}
          </button>
        </form>
      </div>
    </div>
  );
}
