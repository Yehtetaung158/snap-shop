"use client";

import React, { useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { twoFactorSchema } from "@/types/twoFactor-schema";
import { useAction } from "next-safe-action/hooks";
import { twoFactorAction } from "@/server/actions/setting-action";
import { toast } from "sonner";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { useForm } from "react-hook-form";

type TwoFactorProps = {
  isTwoFactorEnabled: boolean;
  email: string;
};

const TwoFactor = ({ isTwoFactorEnabled, email }: TwoFactorProps) => {
  const form = useForm({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      isTwoFactorEnabled,
      email,
    },
  });

  const { execute, status, result } = useAction(twoFactorAction, {
    onSuccess({ data }) {
      form.reset();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data?.success);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof twoFactorSchema>) => {
    const { isTwoFactorEnabled, email } = values;
    execute({ isTwoFactorEnabled, email });
  };

  useEffect(() => {
    form.setValue("isTwoFactorEnabled", isTwoFactorEnabled);
  }, [isTwoFactorEnabled, form]);

  return (
    <Card className=" flex items-center justify-between px-2 py-4 w-full">
      <div>TwoFactor</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              name="isTwoFactorEnabled"
              control={form.control}
              render={({ field }) => (
                <FormItem className=" flex items-end justify-center gap-4">
                  <FormLabel>
                    {isTwoFactorEnabled ? (
                      <p>
                        Two factor is{" "}
                        <span className="text-green-500">enabled</span>
                      </p>
                    ) : (
                      <p>
                        Two factor is{" "}
                        <span className="text-red-500">disabled</span>
                      </p>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Switch
                      disabled={status === "executing"}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={cn(
                "w-full my-4",
                status === "executing" && "animate-pulse",
                isTwoFactorEnabled ? "bg-red-500" : "bg-green-500"
              )}
              disabled={status === "executing"}
            >
              {isTwoFactorEnabled ? "Disable" : "Enable"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default TwoFactor;
