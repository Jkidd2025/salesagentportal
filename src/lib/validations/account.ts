import * as z from "zod";

export const accountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  status: z.enum(["active", "inactive"]),
});

export type AccountFormValues = z.infer<typeof accountSchema>;