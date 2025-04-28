import * as z from "zod";

export const twoFactorSchema = z.object({
  isTwoFactorEnabled: z.boolean(),
  email: z.string().email({ message: "Please enter a valid email address" }),
});
