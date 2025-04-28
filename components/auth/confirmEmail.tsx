"use client";

import { emailConfirmWithToken } from "@/server/actions/tokens";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import AuthForm from "./auth-form";

const confirmEmail = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleConfirmEmail = useCallback(() => {
    if (!token) {
      setError("Invalid token");
      return;
    }

    emailConfirmWithToken(token).then((res) => {
      if (res.success) {
        setSuccess(res.success);
        router.push("/auth/login");
      }
      if (res.error) {
        setError(res.error);
      }
    });
  }, []);
  useEffect(() => {
    handleConfirmEmail();
  }, []);

  return (
    <AuthForm
      formTitle="Confirm Email"
      footerHref="/auth/login"
      showProvider={false}
      footerLabel="Login to your account"
    >
      <p>
        {!success && !error ? "Confirming email..." : success ? success : error}
      </p>
    </AuthForm>
  );
};

export default confirmEmail;
