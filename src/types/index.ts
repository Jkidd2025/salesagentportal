export interface Commission {
  id: string;
  account_id: string;
  rate: number;
  amount: number;
  transaction_date: string;
  created_at?: string;
}

export interface Account {
  id: string;
  name: string;
  status: string;
  total_commissions: number;
  total_residuals: number;
  last_transaction_date: string | null;
}

export interface DateRange {
  from: Date;
  to: Date;
}