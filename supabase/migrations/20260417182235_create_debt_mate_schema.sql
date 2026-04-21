
/*
  # Debt Mate Schema

  ## Summary
  Creates the core tables for the Debt Mate application.

  ## New Tables

  ### debts
  Stores all debt/lending records created by authenticated users.
  - id: UUID primary key
  - user_id: references auth.users (owner)
  - contact_name: name of person who owes money
  - amount: original amount lent
  - paid_amount: cumulative amount paid back (default 0)
  - reason: why the money was lent
  - date: date of the debt
  - notes: optional extra notes
  - status: 'pending' | 'partial' | 'paid'
  - created_at: timestamp

  ### payments
  Stores individual payment transactions against a debt.
  - id: UUID primary key
  - debt_id: references debts
  - user_id: references auth.users (for RLS)
  - amount: payment amount
  - date: payment date
  - notes: optional notes
  - created_at: timestamp

  ## Security
  - RLS enabled on both tables
  - Users can only access their own records
*/

CREATE TABLE IF NOT EXISTS debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_name text NOT NULL,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  paid_amount numeric(12, 2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
  reason text NOT NULL DEFAULT '',
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id uuid NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(12, 2) NOT NULL CHECK (amount > 0),
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own debts"
  ON debts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own debts"
  ON debts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own debts"
  ON debts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own debts"
  ON debts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can select own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own payments"
  ON payments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_debts_user_id ON debts(user_id);
CREATE INDEX IF NOT EXISTS idx_debts_status ON debts(status);
CREATE INDEX IF NOT EXISTS idx_payments_debt_id ON payments(debt_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
