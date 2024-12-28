import { supabase } from "@/integrations/supabase/client";

export const cleanupDuplicateCommissions = async () => {
  // Find duplicate commissions based on all fields except id and created_at
  const { data: duplicates, error: findError } = await supabase
    .from("commissions")
    .select("*")
    .order("created_at", { ascending: true });

  if (findError) throw findError;

  // Group by relevant fields to find duplicates
  const groups = duplicates?.reduce((acc: any, curr) => {
    const key = `${curr.account_id}-${curr.amount}-${curr.rate}-${curr.transaction_date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  // Keep only the first entry in each group (oldest)
  const duplicateIds = Object.values(groups)
    .filter((group: any) => group.length > 1)
    .flatMap((group: any) => group.slice(1).map((item: any) => item.id));

  if (duplicateIds.length === 0) {
    return { removed: 0 };
  }

  // Delete duplicates
  const { error: deleteError } = await supabase
    .from("commissions")
    .delete()
    .in("id", duplicateIds);

  if (deleteError) throw deleteError;

  return { removed: duplicateIds.length };
};

export const cleanupDuplicateResiduals = async () => {
  // Similar logic for residuals
  const { data: duplicates, error: findError } = await supabase
    .from("residuals")
    .select("*")
    .order("created_at", { ascending: true });

  if (findError) throw findError;

  const groups = duplicates?.reduce((acc: any, curr) => {
    const key = `${curr.account_id}-${curr.amount}-${curr.rate}-${curr.period_start}-${curr.period_end}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  const duplicateIds = Object.values(groups)
    .filter((group: any) => group.length > 1)
    .flatMap((group: any) => group.slice(1).map((item: any) => item.id));

  if (duplicateIds.length === 0) {
    return { removed: 0 };
  }

  const { error: deleteError } = await supabase
    .from("residuals")
    .delete()
    .in("id", duplicateIds);

  if (deleteError) throw deleteError;

  return { removed: duplicateIds.length };
};

export const validateAccountData = async () => {
  const { data: accounts, error: accountsError } = await supabase
    .from("accounts")
    .select(`
      id,
      name,
      status,
      total_commissions,
      total_residuals,
      last_transaction_date
    `);

  if (accountsError) throw accountsError;

  const issues = [];

  for (const account of accounts || []) {
    // Check for valid name
    if (!account.name || account.name.length < 2) {
      issues.push({
        accountId: account.id,
        issue: "Invalid account name",
        details: "Name must be at least 2 characters long",
      });
    }

    // Check for valid status
    if (!["active", "inactive"].includes(account.status)) {
      issues.push({
        accountId: account.id,
        issue: "Invalid status",
        details: "Status must be either 'active' or 'inactive'",
      });
    }

    // Check for negative amounts
    if (account.total_commissions < 0 || account.total_residuals < 0) {
      issues.push({
        accountId: account.id,
        issue: "Negative totals",
        details: "Total amounts should not be negative",
      });
    }
  }

  return issues;
};
