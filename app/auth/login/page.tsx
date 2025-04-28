"use client";

import AuthForm from "@/components/auth/auth-form";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema } from "@/types/login-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { login } from "@/server/actions/login-actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Login = () => {
  const [isTwoFactorOn, setIsTwoFactorOn] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const { execute, status, result } = useAction(login, {
    onSuccess({ data }) {
      console.log("I am login success------------ .", data);
      if (data?.error) {
        toast.error(data.error);
        form.reset();
      }
      if (data?.success) {
        toast.success(data?.success);
      }
      if (data?.twoFactor) {
        toast.success(data?.twoFactor);
        setIsTwoFactorOn(true);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log(values);
    const { email, password,code } = values;
    execute({ email, password, code });
  };

  return (
    <AuthForm
      formTitle={isTwoFactorOn ? "Two Factor Authentication" : "Login"}
      showProvider={true}
      footerLabel="Don't have an account?"
      footerHref="/auth/register"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {!isTwoFactorOn ? (
              <>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@gmail.com" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size={"sm"} variant={"link"}>
                  <Link href={"/auth/reset"}>Forgot Password</Link>
                </Button>
              </>
            ) : (
              <div className=" w-full flex items-center justify-center py-4">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two Factor Code</FormLabel>
                      <FormControl>
                        <InputOTP
                          maxLength={6}
                          {...field}
                          disabled={status === "executing"}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
            <Button
              className={cn(
                "w-full my-4",
                status === "executing" && "animate-pulse"
              )}
              disabled={status === "executing"}
            >
              {isTwoFactorOn ? (
                <>{status === "executing" ? "Verifying...." : "Verify"}</>
              ) : (
                <>{status === "executing" ? "Loading...." : "Login"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </AuthForm>
  );
};

export default Login;
