"use server";

import { loginSchema } from "@/types/login-schema";
import { actionClient } from "./safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { twoFactorToken, users } from "../schema";
import {
  generateEmailValidationToken,
  generateTwoFactorCode,
  getTwoFactorCodeByEmail,
} from "./tokens";
import { sendEmail, sendTwoFactorEmail } from "./emails";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

export const login = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    console.log("email", email, "password", password, "code", code);
    try {
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser?.email !== email) {
        return {
          error: "Please provide valid credentials",
        };
      }

      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailValidationToken(
          existingUser.email
        );
        sendEmail(
          verificationToken[0].email,
          verificationToken[0].token,
          existingUser.name!.slice(0, 5)
        );
        return { success: "Email verification resent00" };
      }

      if (existingUser.isTwoFactorEnabled) {
        if (code) {
          const twoFactorEnabledUser = await getTwoFactorCodeByEmail(email);
          if (!twoFactorEnabledUser) {
            return {
              error: "Invalid two factor code",
            };
          }
          if (twoFactorEnabledUser.token !== code) {
            return {
              error: "Invalid two factor code",
            };
          }
          const isExpired = new Date() > new Date(twoFactorEnabledUser.expires);
          if (isExpired) {
            return {
              error: "Two factor code expired",
            };
          }
          await db
            .delete(twoFactorToken)
            .where(eq(twoFactorToken.id, twoFactorEnabledUser.id));
        } else {
          const twoFactorCode = await generateTwoFactorCode(existingUser.email);
          if (!twoFactorCode) {
            return {
              error: "Failed to generate two factor code",
            };
          }
          await sendTwoFactorEmail(
            twoFactorCode[0].email,
            twoFactorCode[0].token
          );
          return {
            twoFactor: "Two factor code sent successfully",
          };
        }
      }

      await signIn("credentials", { email, password, redirectTo: "/" });

      return { success: "Logged in successfully" };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin": {
            return { error: "Please provide valid credentials" };
          }
          case "OAuthSignInError": {
            return { error: error.message };
          }
        }
      }
      throw error;
    }
  });
