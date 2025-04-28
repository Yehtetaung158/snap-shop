"use client";

import AuthForm from "@/components/auth/auth-form";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { changePasswordSchema } from "@/types/change-password-schema";
import { changePassword } from "@/server/actions/change-password-action";
import { redirect, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";

const ChangePassword = () => {
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { execute, status, result } = useAction(changePassword, {
    onSuccess({ data }) {
      console.log("I am login success---- .", data);
      form.reset();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        signOut({ callbackUrl: "/auth/login" });
        toast.success(data?.success);
      }
    },
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    console.log(values);
    const { password } = values;
    execute({ password, token });
  };

  return (
    <AuthForm
      formTitle="Change Password"
      showProvider={false}
      footerLabel="Already have an account?"
      footerHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="****" {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className={cn(
                "w-full my-4",
                status === "executing" && "animate-pulse"
              )}
              disabled={status === "executing"}
            >
              {status === "executing" ? "Loading........." : "Change Password"}
            </Button>
          </div>
        </form>
      </Form>
    </AuthForm>
  );
};

export default ChangePassword;
