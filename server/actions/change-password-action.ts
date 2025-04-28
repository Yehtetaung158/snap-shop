"use server";

import { actionClient } from "./safe-action";
import { changePasswordSchema } from "@/types/change-password-schema";
import { checkPasswordResetTokenByToken } from "./tokens";
import { db } from "..";
import { eq } from "drizzle-orm";
import { resetPasswordToken, users } from "../schema";
import bcrypt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

export const changePassword = actionClient
  .schema(changePasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({
      connectionString:
        "postgresql://snap-shop_owner:npg_ljZTM6hYRe7a@ep-sweet-flower-a8pmb61j-pooler.eastus2.azure.neon.tech/snap-shop?sslmode=require",
    });
    const dbPool = drizzle(pool);
    try {
      if (!token) {
        return { error: "Missing token" };
      }
      const existingToken = await checkPasswordResetTokenByToken(token);
      if (!existingToken) {
        return { error: "Invalid token" };
      }

      const isExpired = new Date() > new Date(existingToken.expires);
      if (isExpired) {
        return { error: "Token expired, please request a new one" };
      }

      const isExistingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email),
      });
      if (!isExistingUser) {
        return { error: "User not found" };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await dbPool.transaction(async (context) => {
        await context
          .update(users)
          .set({ password: hashedPassword })
          .where(eq(users.id, isExistingUser.id));
        await context
          .delete(resetPasswordToken)
          .where(eq(resetPasswordToken.token, token));
      });

      return { success: "Password changed successfully" };
    } catch (error) {
      return { error: "Failed to change password" };
    }
  });
