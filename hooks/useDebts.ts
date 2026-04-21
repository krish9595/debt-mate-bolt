import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Debt, AddDebtForm } from '@/types';

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('debts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setDebts(data ?? []);
    setLoading(false);
  }, []);

  const addDebt = async (form: AddDebtForm): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'Not authenticated';

    const { error } = await supabase.from('debts').insert({
      user_id: user.id,
      contact_name: form.contact_name.trim(),
      amount: parseFloat(form.amount),
      reason: form.reason.trim(),
      date: form.date,
      notes: form.notes.trim(),
      status: 'pending',
    });

    if (error) return error.message;
    await fetchDebts();
    return null;
  };

  const addPayment = async (debtId: string, amount: number): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'Not authenticated';

    const debt = debts.find((d) => d.id === debtId);
    if (!debt) return 'Debt not found';

    const newPaid = debt.paid_amount + amount;
    const newStatus = newPaid >= debt.amount ? 'paid' : newPaid > 0 ? 'partial' : 'pending';

    const { error: payErr } = await supabase.from('payments').insert({
      debt_id: debtId,
      user_id: user.id,
      amount,
      date: new Date().toISOString().split('T')[0],
    });
    if (payErr) return payErr.message;

    const { error: updateErr } = await supabase
      .from('debts')
      .update({ paid_amount: newPaid, status: newStatus })
      .eq('id', debtId);

    if (updateErr) return updateErr.message;
    await fetchDebts();
    return null;
  };

  const markAsPaid = async (debtId: string): Promise<string | null> => {
    const debt = debts.find((d) => d.id === debtId);
    if (!debt) return 'Debt not found';

    const remaining = debt.amount - debt.paid_amount;
    if (remaining > 0) {
      return addPayment(debtId, remaining);
    }

    const { error } = await supabase
      .from('debts')
      .update({ status: 'paid', paid_amount: debt.amount })
      .eq('id', debtId);

    if (error) return error.message;
    await fetchDebts();
    return null;
  };

  const deleteDebt = async (debtId: string): Promise<string | null> => {
    const { error } = await supabase.from('debts').delete().eq('id', debtId);
    if (error) return error.message;
    await fetchDebts();
    return null;
  };

  return { debts, loading, error, fetchDebts, addDebt, addPayment, markAsPaid, deleteDebt };
}
