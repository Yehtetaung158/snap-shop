"use server";

import { avatarUploadSchema, profileSchema } from "@/types/profile-schema";
import { actionClient } from "./safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { twoFactorSchema } from "@/types/twoFactor-schema";
import { log } from "console";

export const settingAction = actionClient
  .schema(profileSchema)
  .action(async ({ parsedInput: { name, email } }) => {
    try {
      const isExistingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (!isExistingUser) {
        return { error: "User not found" };
      }

      await db.update(users).set({ name }).where(eq(users.email, email));
      revalidatePath("/dashboard/settings");
      return { success: "Profile updated successfully" };
    } catch (error) {
      return { error: "Error updating profile" };
    }
  });

export const twoFactorAction = actionClient
  .schema(twoFactorSchema)
  .action(async ({ parsedInput: { isTwoFactorEnabled, email } }) => {
    log(isTwoFactorEnabled);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existingUser) {
      return { error: "Something went wrong" };
    }

    await db
      .update(users)
      .set({ isTwoFactorEnabled: isTwoFactorEnabled })
      .where(eq(users.email, email));

    revalidatePath("/dashboard/settings");

    return { success: "Two factor disabled" };
  });

export const profileUpdateAction = actionClient
  .schema(avatarUploadSchema)
  .action(async ({ parsedInput: { image, email } }) => {
    if (!image) {
      return { error: "Image is required" };
    }
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existingUser) {
      return { error: "Something went wrong" };
    }
    await db.update(users).set({ image }).where(eq(users.email, email));
    revalidatePath("/dashboard/settings");
    revalidatePath("/");
    return { success: "Image uploaded successfully" };
  });
