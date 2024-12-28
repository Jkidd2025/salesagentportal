import * as z from "zod";

export const commissionSchema = z.object({
  accountId: z.string().uuid("Invalid account ID"),
  amount: z.number().positive("Amount must be positive"),
  rate: z.number().min(0, "Rate cannot be negative").max(100, "Rate cannot exceed 100%"),
  transactionDate: z.date({
    required_error: "Transaction date is required",
    invalid_type_error: "Invalid date format",
  }),
});

export type CommissionFormValues = z.infer<typeof commissionSchema>;