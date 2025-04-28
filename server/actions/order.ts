"use server";

import { createOrderSchema, updateOrderSchema } from "@/types/order-schema";
import { actionClient } from "./safe-action";
import { auth } from "../auth";
import { orderProduct, orders } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "..";

export const createOrder = actionClient
  .schema(createOrderSchema)
  .action(async ({ parsedInput: { products, totalPrice, status } }) => {
    const session = await auth();
    if (!session) return { error: "You need to be logged in" };

    const order = await db
      .insert(orders)
      .values({
        status,
        total: totalPrice,
        userID: session.user.id as string,
      })
      .returning();

    products.map(async ({ productId, quantity, variantId }) => {
      await db.insert(orderProduct).values({
        quantity,
        productID: productId,
        productVariantID: variantId,
        orderID: order[0].id,
      });
    });
    return { success: "Order added." };
  });

export const updateOrderStatus = actionClient
  .schema(updateOrderSchema)
  .action(async ({ parsedInput: { status, id } }) => {
    const order = await db.query.orders.findFirst({ where: eq(orders.id, id) });
    if (!order) {
      return { error: "Order not found" };
    }
    await db.update(orders).set({ status }).where(eq(orders.id, id));
    revalidatePath("/dashboard/orders");
    return { success: "Order status updated." };
  });
