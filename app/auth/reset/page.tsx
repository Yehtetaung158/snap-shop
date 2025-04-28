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
import { passwordResetSchema } from "@/types/password-reset-schema";
import { resetPassword } from "@/server/actions/reset-password-action";


const ResetPassword = () => {
  const form = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status, result } = useAction(resetPassword, {
    onSuccess({ data }) {
      console.log("I am login success------------ .", data);
      form.reset();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data?.success, {
          action: {
            label: "Open Email",
            onClick: () => {
              window.open("https://mail.google.com/", "_blank");
            },
          },
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof passwordResetSchema>) => {
    console.log(values);
    const { email } = values;
    execute({ email });
  };

  return (
    <AuthForm
      formTitle="Reset Password"
      showProvider={false}
      footerLabel="Already have an account?"
      footerHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
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
            {/* <Button size={"sm"} variant={"link"}>
              <Link href={"/auth/reset"}>Forgot Password</Link>
            </Button> */}

            <Button
              className={cn(
                "w-full my-4",
                status === "executing" && "animate-pulse"
              )}
              disabled={status === "executing"}
            >
              {status === "executing" ? "Loading....." : "Reset Password"}
            </Button>
          </div>
        </form>
      </Form>
    </AuthForm>
  );
};

export default ResetPassword;
