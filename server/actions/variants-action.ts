"use server";
import { VariantSchema } from "@/types/varant-schema";
import { actionClient } from "./safe-action";
import { db } from "..";
import { productVariants, variantImages, variantsTags } from "../schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const variantsAction = actionClient
  .schema(VariantSchema)
  .action(
    async ({
      parsedInput: {
        color,
        tags,
        id,
        variantImages: vImages,
        editMode,
        productID,
        productType,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({
              color,
              productType,
              updatedAt: new Date(),
            })
            .where(eq(productVariants.id, id))
            .returning();
          await db
            .delete(variantsTags)
            .where(eq(variantsTags.variantId, editVariant[0].id));
          await db.insert(variantsTags).values(
            tags.map((tag) => {
              return {
                tag,
                variantId: editVariant[0].id,
              };
            })
          );
          await db
            .delete(variantImages)
            .where(eq(variantImages.variantId, editVariant[0].id));
          await db.insert(variantImages).values(
            vImages.map((img, index) => {
              return {
                image_url: img.url,
                size: img.size.toString(),
                name: img.name,
                variantId: editVariant[0].id,
                order: index,
              };
            })
          );
          revalidatePath("/dashboard/products");
          return { success: `Variants updated.` };
        }
        if (!editMode) {
          const variant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productId: productID,
            })
            .returning();
          const product = await db.query.products.findFirst({
            where: (products, { eq }) => eq(products.id, productID),
          });
          await db.insert(variantsTags).values(
            tags.map((tag) => ({
              tag,
              variantId: variant[0].id,
            }))
          );
          await db.insert(variantImages).values(
            vImages.map((image, index) => {
              return {
                image_url: image.url,
                name: image.name,
                variantId: variant[0].id,
                size: image.size.toString(),
                order: index,
              };
            })
          );
          revalidatePath("/dashboard/products");
          return { success: `${product?.title} Variant created successfully` };
        }
      } catch (error) {
        console.error(error);
        return { error: "Error creating variant" };
      }
    }
  );

export const deleteVariantAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      await db.delete(productVariants).where(eq(productVariants.id, id));
      revalidatePath("/dashboard/products");
      return { success: "Variant deleted successfully" };
    } catch (error) {
      console.error(error);
      return { error: "Error deleting variant" };
    }
  });
