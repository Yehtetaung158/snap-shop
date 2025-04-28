"use server";

import { actionClient } from "./safe-action";
import { productSchema } from "@/types/product-schema";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const productCreateAndUpdateAction = actionClient
  .schema(productSchema)
  .action(async ({ parsedInput: { id, description, price, title } }) => {
    console.log(id, description, price, title);
    try {
      console.log(id, title, description, price);
      if (id) {
        const existingProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });

        if (!existingProduct) {
          return { error: "Product not found" };
        }

        await db
          .update(products)
          .set({ title, description, price })
          .where(eq(products.id, id));
        return { success: `${title} updated successfully` };
      } else {
        const product = await db
          .insert(products)
          .values({ title, description, price })
          .returning();
        return { success: `${product[0].title} created successfully` };
      }
    } catch (error) {
      console.log(error);
      return { error: "Something went wrong" };
    }
  });

export const getSingleProduct = async (id: number) => {
  try {
    const product = await db.query.products.findFirst({
      where: (products, { eq }) => eq(products.id, id),
    });

    if (!product) return { error: "Product not found" };
    return { success: product };
  } catch (error) {
    console.log(error);
    return {
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }
};

const deleteProductSchema = z.object({
  id: z.number(),
});
export const deleteProduct = actionClient
  .schema(deleteProductSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      await db.delete(products).where(eq(products.id, id));
      revalidatePath("/dashboard/products");
      return { success: "Product deleted successfully" };
    } catch (error) {
      return { error: "Something went wrong" };
    }
  });
