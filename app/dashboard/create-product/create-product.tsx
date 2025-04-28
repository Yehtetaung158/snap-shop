"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { productSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button"; // Added submit button
import { Banknote, Loader2, Plus } from "lucide-react";
import Tiptap from "./Tiptap";
import {
  getSingleProduct,
  productCreateAndUpdateAction,
} from "@/server/actions/product-action";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const CreateProductForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit_id") || null;

  const isProductExist = async (id: number) => {
    if (isEdit) {
      const response = await getSingleProduct(id);
      if (response?.error) {
        toast.error(response.error);
        router.push("/dashboard/products");
        return false;
      }
      if (response?.success) {
        form.setValue("title", response?.success.title);
        form.setValue("description", response?.success.description);
        form.setValue("price", response?.success.price);
        form.setValue("id", response?.success.id);
      }
    }
  };

  // Removed async
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });
  console.log("form", form.getValues());

  const { execute, status, result } = useAction(productCreateAndUpdateAction, {
    onSuccess({ data }) {
      console.log("I am login success------------ .", data);
      form.reset();
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data?.success);
        router.push("/dashboard/products");
      }
    },
  });

  console.log(" I am status", status, result);
  console.log(" I am form error", form.formState.errors);

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    console.log(values);
    const { title, id, description, price } = values;
    execute({ id, title, description, price });
  };

  useEffect(() => {
    if (isEdit) {
      isProductExist(Number(isEdit));
    }
  },[]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Product</CardTitle>
        <CardDescription>Create a new product</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price (MMK)</FormLabel> {/* Fixed label */}
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Banknote />
                      <Input
                        placeholder="Enter price in MMKs"
                        type="number"
                        step={100}
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </div>
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
              {status === "executing" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {status === "executing" ? "Creating..." : "Create Product"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateProductForm;
