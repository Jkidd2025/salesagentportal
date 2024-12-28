import * as z from "zod";

export const residualSchema = z.object({
  accountId: z.string().uuid("Invalid account ID"),
  amount: z.number().positive("Amount must be positive"),
  rate: z.number().min(0, "Rate cannot be negative").max(100, "Rate cannot exceed 100%"),
  periodStart: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Invalid start date format",
  }),
  periodEnd: z.date({
    required_error: "End date is required",
    invalid_type_error: "Invalid end date format",
  }),
}).refine(data => data.periodEnd >= data.periodStart, {
  message: "End date must be after start date",
  path: ["periodEnd"],
});

export type ResidualFormValues = z.infer<typeof residualSchema>;