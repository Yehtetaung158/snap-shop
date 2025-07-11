"use server";

import { between, eq } from "drizzle-orm";
import { db } from "@/server/index";
import { orders } from "../schema";
import { users } from "../schema";
import { products } from "../schema";
import { endOfDay, format, startOfDay, subDays } from "date-fns";

export const analytics = async () => {
  try {
    const pendingOrder = await db
      .select()
      .from(orders)
      .where(eq(orders.status, "pending"));

    const completedOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.status, "completed"));

    const userCount = await db.select().from(users);

    const productCount = await db.select().from(products);

    return {
      pendingOrder: pendingOrder.length,
      totalUser: userCount.length,
      productCount: productCount.length,
      completedOrder: completedOrders.length,
    };
  } catch (error) {
    console.log(error);
  }
};

export const weeklyAnalytics = async () => {
    try {
      const today = new Date();
  
      const days = Array.from({ length: 7 }, (_, index) => {
        return format(subDays(today, index), "yyyy-MM-dd");
      }).reverse();
  
      const data = await Promise.all(
        days.map(async (day) => {
          const startDay = startOfDay(new Date(day));
          const endDay = endOfDay(new Date(day));
  
          const orderData = await db
            .select({ count: orders.id })
            .from(orders)
            .where(between(orders.created, startDay, endDay));
  
          return { day, count: orderData.length };
        })
      );
  
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  
