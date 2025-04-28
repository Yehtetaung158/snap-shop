"use server";

import { registerSchema } from "@/types/register-schema";
import { actionClient } from "./safe-action";
import bcrypt from "bcrypt";
import { db } from "..";
import { eq, is } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailValidationToken } from "./tokens";
import { sendEmail } from "./emails";

export const register = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const hashPassword = await bcrypt.hash(password, 10);
    const isExistingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (isExistingUser) {
      if (!isExistingUser.emailVerified) {
        const veriFicationToken=await generateEmailValidationToken(email);
        await sendEmail(
          veriFicationToken[0].email,
          veriFicationToken[0].token,
          name.slice(0, 5)
        )
        return {
          success: "Email validation is sent  ",
        };
      }
      return {
        error: "User already exists",
      };
    }

    //record user
    await db.insert(users).values({
      name,
      email,
      password: hashPassword,
    })
    // generate token that expire is 30 min
    const veriFicationToken=generateEmailValidationToken(email);
    console.log("I am verification token",veriFicationToken);

    return {
      success: "Email validation is sent to your email",
    };
  });
