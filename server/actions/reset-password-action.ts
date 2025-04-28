"use server";

import { passwordResetSchema } from "@/types/password-reset-schema";
import { actionClient } from "./safe-action";
import { db } from "@/server";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./emails";

export const resetPassword = actionClient
  .schema(passwordResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existingUser) {
      return {
        error: "Email not found",
      };
    }

    const resetPasswordToken = await generatePasswordResetToken(email);
    if (!resetPasswordToken) {
      return {
        error: "Failed to generate reset password token",
      };
    }
    await sendPasswordResetEmail(
      resetPasswordToken[0].email,
      resetPasswordToken[0].token
    );

    return { success: "Reset password link is sent to your email" };
  });
