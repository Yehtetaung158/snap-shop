"use client";

import React from "react";
import { Card } from "../ui/card";
import { Key } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { passwordResetSchema } from "@/types/password-reset-schema";
import { resetPassword } from "@/server/actions/reset-password-action";
import { signOut } from "next-auth/react";

type changePasswordProps = {
  email: string;
};

const ChangePassword = ({ email }: changePasswordProps) => {
  const form = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: email ? email : "",
    },
  });
  const { execute, status, result } = useAction(resetPassword, {
    onSuccess({ data }) {
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
    <Card className=" flex items-center justify-between px-2 py-4 w-full">
      <p>ChangePassword</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Button
            type="submit"
            className={cn(
              "w-full my-4",
              status === "executing" && "animate-pulse"
            )}
            disabled={status === "executing"}
          >
            <Key className="w-4 h-4" />
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default ChangePassword;
