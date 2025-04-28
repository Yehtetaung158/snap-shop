"use client";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { UploadButton } from "@/app/api/uploadthing/uploadthing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { avatarUploadSchema } from "@/types/profile-schema";
import { useAction } from "next-safe-action/hooks";
import { profileUpdateAction } from "@/server/actions/setting-action";
import { toast } from "sonner";
import { set, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { CheckCheck, Pencil, Save, X } from "lucide-react";

type AvatarUploadFormProps = {
  image: string | null;
  name: string;
  email: string;
};

const AvatarUploadForm = ({ image, name, email }: AvatarUploadFormProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const handleEditClick = () => {
    const fileInput = document.querySelector(
      '#avatar-uploader input[type="file"]'
    );
    (fileInput as HTMLInputElement)?.click();
  };

  const form = useForm({
    resolver: zodResolver(avatarUploadSchema),
    defaultValues: {
      image: image || undefined,
      email: email,
    },
  });

  const { execute, status } = useAction(profileUpdateAction, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.error(data.error);
        setIsSelected(false);
      }
      if (data?.success) {
        toast.success(data?.success);
        setIsSelected(false);
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof avatarUploadSchema>) => {
    const { image } = values;
    execute({ image, email });
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-4 lg:px-0"
        >
          <FormField
            name="image"
            control={form.control}
            render={({ field }) => (
              <FormItem className=" relative">
                {isUploading && (
                  <Avatar className="w-14 h-14 bg-primary">
                    <AvatarFallback className="bg-primary text-white font-bold w-full h-full flex items-center justify-center text-[8px]">
                      loading..
                    </AvatarFallback>
                  </Avatar>
                )}
                {!isUploading && (
                  <div>
                    <Avatar className="w-14 h-14 bg-primary">
                      {form.getValues("image") && (
                        <AvatarImage src={form.getValues("image")!} />
                      )}
                      {!form.getValues("image") && (
                        <AvatarFallback className="bg-primary text-white font-bold w-full h-full flex items-center justify-center">
                          {name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {!isSelected && (
                      <button
                        type="button"
                        className="w-6 h-6 bg-primary rounded-full flex items-center justify-center absolute bottom-0 right-0"
                        onClick={handleEditClick}
                      >
                        <Pencil className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                )}

                <div id="avatar-uploader" className="hidden">
                  <UploadButton
                    className="scale-75 ut-button:bg-primary ut-label:text-red-500 hover:ut-button:ring-primary ut-button:ring-primary "
                    endpoint="imageUploader"
                    onUploadBegin={() => {
                      setIsUploading(true);
                    }}
                    onUploadError={(error) => {
                      form.setError("image", {
                        type: "validate",
                        message: error.message,
                      });
                      setIsUploading(false);
                      return;
                    }}
                    content={{
                      button({ ready }) {
                        if (ready) return <div>Upload Avatar</div>;
                        return <div>Uploading...</div>;
                      },
                    }}
                    onClientUploadComplete={(res) => {
                      form.setValue("image", res[0].url!);
                      setIsUploading(false);
                      setIsSelected(true);
                      return;
                    }}
                  />
                </div>

                <FormControl>
                  <Input {...field} type="hidden" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isSelected && (
            <div className=" flex gap-2">
              <Button
                className=" bg-white text-red-500 border border-red-500"
                disabled={status === "executing" || isUploading}
                type="button"
                onClick={() => {
                  setIsSelected(false);
                  form.reset();
                }}
              >
                <X />
              </Button>
              <Button
                className=" bg-white text-green-500 border border-green-500"
                type="submit"
                disabled={status === "executing" || isUploading}
              >
                {status === "executing" ? (
                  "Saving..."
                ) : isUploading ? (
                  "Uploading..."
                ) : (
                  <CheckCheck />
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default AvatarUploadForm;
