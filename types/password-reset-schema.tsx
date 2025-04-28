import * as z from "zod";

export const passwordResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  // code: z.string().optional(),
});
