"use client";

import AuthForm from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/server/actions/login-actions";
import { registerSchema } from "@/types/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAction } from "next-safe-action/hooks";
import { register } from "@/server/actions/register-actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Register = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { execute, isExecuting, status, result } = useAction(register, {
    onSuccess: ({ data }) => {
      form.reset();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data?.success, {
          action: {
            label: "Open Gmail",
            onClick: () => {
              window.open("https://mail.google.com/", "_blank");
            },
          },
        });
      }
    },
  });
  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { name, email, password } = values;
    try {
      await execute({ name, email, password }); // ✅ Ensure `execute()` is awaited
      console.log("Execution completed: ", { isExecuting, status, result });
    } catch (error) {
      console.error("Error during execution:", error);
    }
  };

  return (
    <AuthForm
      formTitle="Register"
      showProvider={true}
      footerLabel="I have an account"
      footerHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ye Htet Aung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@gmail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
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
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
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
              {status === "executing"
                ? "Registering...................."
                : "Register"}
            </Button>
          </div>
        </form>
      </Form>
    </AuthForm>
  );
};

export default Register;
