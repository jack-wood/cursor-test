"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "~/auth/client";
import type { User } from "@supabase/supabase-js";
import { cn } from "~/lib/utils";

export function AuthShowcase() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.refresh();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Link
        href="/auth/signin"
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl">
        <span>Logged in as {user.email}</span>
      </p>

      <button
        onClick={handleSignOut}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-6 bg-blue-600 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        Sign out
      </button>
    </div>
  );
}
