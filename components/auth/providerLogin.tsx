"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";

const ProviderLogin = () => {
  const [loading, setLoading] = useState<string | null>(null); // Track loading state

  const handleSignIn = async (provider: "google" | "github") => {
    setLoading(provider); // Set loading state

    try {
      await signIn(provider, {
        redirect: false,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setLoading(null); // Reset loading state after completion
    }
  };

  return (
    <div className="flex items-start justify-center gap-2 flex-col">
      <Button
        onClick={() => handleSignIn("google")}
        disabled={loading === "google"}
      >
        {loading === "google" ? "Signing in..." : "Google"}
      </Button>
      <Button
        onClick={() => handleSignIn("github")}
        disabled={loading === "github"}
      >
        {loading === "github" ? (
          "Signing in..."
        ) : (
          <>
            <Github /> GitHub
          </>
        )}
      </Button>
    </div>
  );
};

export default ProviderLogin;
