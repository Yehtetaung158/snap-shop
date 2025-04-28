// "use client";

import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/types/profile-schema";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { settingAction } from "@/server/actions/setting-action";
import { Session } from "next-auth";
import { toast } from "sonner";

type ProfileFormProps = {
  session: Session;
  setIsOpen:()=>void;
};

const ProfileForm = ({ session, setIsOpen }: ProfileFormProps) => {
  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  
  const { execute, status } = useAction(settingAction, {
    onSuccess({ data }) {
      form.reset();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        setIsOpen();
        toast.success(data?.success);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof profileSchema>) => {
    const { name, email } = values;
    execute({ name, email });
  };

  return (
    <div>
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
                    <Input {...field} />
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
              {status === "executing" ? "Loading...." : "Update Profile Name"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
