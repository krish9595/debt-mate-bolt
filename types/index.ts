export type DebtStatus = 'pending' | 'partial' | 'paid';

export interface Debt {
  id: string;
  user_id: string;
  contact_name: string;
  amount: number;
  paid_amount: number;
  reason: string;
  date: string;
  notes: string;
  status: DebtStatus;
  created_at: string;
}

export interface Payment {
  id: string;
  debt_id: string;
  user_id: string;
  amount: number;
  date: string;
  notes: string;
  created_at: string;
}

export interface ContactSummary {
  name: string;
  totalLent: number;
  totalPaid: number;
  outstanding: number;
  debtCount: number;
}

export interface AddDebtForm {
  contact_name: string;
  amount: string;
  reason: string;
  date: string;
  notes: string;
}
