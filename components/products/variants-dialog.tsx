"use client";

import { VariantsWithImagesTags } from "@/lib/infer-types";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { VariantSchema } from "@/types/varant-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TagInput from "./tags-input";
import VariantImage from "./variant-image";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  deleteVariantAction,
  variantsAction,
} from "@/server/actions/variants-action";
import { variantsTags } from "@/server/schema";

type VariantsDialogProps = {
  children: React.ReactNode;
  editMode: boolean;
  productId?: number;
  variantId?: VariantsWithImagesTags;
  variants?: VariantsWithImagesTags;
};

const VariantsDialog = ({
  children,
  editMode,
  productId,
  variantId,
  variants,
}: VariantsDialogProps) => {
  const [open, setOpen] = useState(false);

  const getOldData = () => {
    if (editMode && variants) {
      form.setValue("editMode", true);
      form.setValue("id", variants.id);
      form.setValue("color", variants.color);
      form.setValue(
        "tags",
        variants.variantsTags.map((tag) => tag.tag)
      );
      form.setValue(
        "variantImages",
        variants?.variantImages.map((img) => {
          return {
            url: img.image_url,
            size: Number(img.size),
            name: img.name,
          };
        })
      );
      form.setValue("productType", variants.productType);
      form.setValue("productID", variants.productId);
    }
  };

  useEffect(() => {
    getOldData();
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [
        "iPhone",
        "iPad",
        "MacBook",
        "Apple Watch",
        "Accessories",
        "Covers",
      ],
      color: "#000",
      variantImages: [],
      productID: productId,
      id: undefined,
      productType: "",
      editMode,
    },
  });

  const { execute, status, result } = useAction(variantsAction, {
    onSuccess({ data }) {
      form.reset();
      setOpen(false);
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data?.success);
      }
    },
  });

  const deleteVariant = useAction(deleteVariantAction, {
    onSuccess({ data }) {
      form.reset();
      setOpen(false);
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data?.success);
      }
    },
  });

  function onSubmit(values: z.infer<typeof VariantSchema>) {
    console.log(values);
    const { color, tags, id, variantImages, productID, productType } = values;
    execute({
      color,
      tags,
      id,
      variantImages,
      productID,
      productType,
      editMode,
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit Variant" : "Add Variant"}</DialogTitle>
          <DialogDescription>Manage your variants</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Variant Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      handleOnChange={(e) => field.onChange(e)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <VariantImage />
            <div className="flex gap-2 w-full items-center justify-between">
              <Button
                type="submit"
                disabled={status === "executing" || !form.formState.isValid}
              >
                {editMode
                  ? "Update product's variant"
                  : "Create product's variant"}
              </Button>
              {editMode && (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    deleteVariant.execute({ id: variants?.id! });
                  }}
                  className=" bg-red-500"
                  type="button"
                  disabled={status === "executing" || !form.formState.isValid}
                >
                  Delete product's variant"
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default VariantsDialog;
