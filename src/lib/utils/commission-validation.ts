import { supabase } from "@/integrations/supabase/client";
import type { CommissionFormValues } from "@/lib/validations/commission";

export const checkDuplicateCommission = async (data: CommissionFormValues) => {
  const { data: existingCommissions } = await supabase
    .from("commissions")
    .select("*")
    .eq("account_id", data.accountId)
    .eq("amount", data.amount)
    .eq("rate", data.rate)
    .eq("transaction_date", data.transactionDate.toISOString().split("T")[0]);

  return existingCommissions && existingCommissions.length > 0;
};