"use client";
import { VariantSchema } from "@/types/varant-schema";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { UploadDropzone } from "@/app/api/uploadthing/uploadthing";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const VariantImage = () => {
  const { getValues, setValue, control, setError } =
    useFormContext<z.infer<typeof VariantSchema>>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variantImages",
  });

  return (
    <div>
      <FormField
        control={control}
        name="variantImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload Variant Image</FormLabel>
            <FormDescription>
              You can upload multiple 10 images at once
            </FormDescription>
            <FormControl>
              <UploadDropzone
                endpoint="variantImagesUploader"
                className="ut-allowed-content:text-primary ut-label:text-primary ut-button:bg-primary ut-upload-icon:text-primary/50"
                onBeforeUploadBegin={(files) => {
                  files.forEach((file) => {
                    append({
                      name: file.name,
                      size: file.size,
                      url: URL.createObjectURL(file),
                    });
                  });
                  return files;
                }}
                onUploadError={(error) => {
                  console.error("Upload error:", error);
                  setError("variantImages", {
                    type: "validate",
                    message: error.message,
                  });
                }}
                onClientUploadComplete={(data) => {
                  const variantImages = getValues("variantImages");
                  console.log("Client upload complete:", variantImages);
                  variantImages.forEach((variantImage, index) => {
                    if (variantImage.url.startsWith("blob:")) {
                      const image = data.find(
                        (i) => i.name === variantImage.name
                      );
                      if (image) {
                        update(index, {
                          url: image.url,
                          name: image.name,
                          size: image.size,
                          key: image.key,
                        });
                      }
                    }
                  });
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex items-center gap-2 mb-2 w-full  flex-wrap p-2 rounded-md  my-3">
        {fields.map((field, index) => (
          <div
            key={index}
            className={cn(
              "relative w-20 h-20 overflow-hidden rounded-md border border-gray-300 shadow-sm"
              //   field.url.startsWith("blob:") ? "animate-pulse" : ""
            )}
          >
            <button
              className=" absolute -top-0.5 -right-0.5 bg-red-200 text-red-600 rounded-full p-0.5 z-40"
              type="button"
              onClick={() => remove(index)}
            >
              <X className="w-4 h-4" />
            </button>
            <img
              className="w-20 h-20 object-cover"
              alt={field.name}
              width={100}
              height={100}
              src={field.url}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantImage;
