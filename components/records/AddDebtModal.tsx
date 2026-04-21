import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { AddDebtForm } from '@/types';

interface AddDebtModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (form: AddDebtForm) => Promise<string | null>;
}

const today = new Date().toISOString().split('T')[0];

export function AddDebtModal({ visible, onClose, onSubmit }: AddDebtModalProps) {
  const { theme } = useTheme();
  const [form, setForm] = useState<AddDebtForm>({
    contact_name: '',
    amount: '',
    reason: '',
    date: today,
    notes: '',
  });
  const [errors, setErrors] = useState<Partial<AddDebtForm>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const update = (key: keyof AddDebtForm) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Partial<AddDebtForm> = {};
    if (!form.contact_name.trim()) e.contact_name = 'Name is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Valid amount required';
    if (!form.reason.trim()) e.reason = 'Reason is required';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError(null);
    const err = await onSubmit(form);
    setLoading(false);
    if (err) {
      setServerError(err);
    } else {
      setForm({ contact_name: '', amount: '', reason: '', date: today, notes: '' });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setForm({ contact_name: '', amount: '', reason: '', date: today, notes: '' });
    setErrors({});
    setServerError(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={[theme.primaryGradientStart, theme.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.title}>Add Debt Record</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {serverError && (
            <View style={[styles.errorBanner, { backgroundColor: theme.dangerLight }]}>
              <Text style={[styles.errorBannerText, { color: theme.danger }]}>{serverError}</Text>
            </View>
          )}

          <Input
            label="Contact Name"
            placeholder="Who borrowed money?"
            value={form.contact_name}
            onChangeText={update('contact_name')}
            error={errors.contact_name}
            autoCapitalize="words"
          />
          <Input
            label="Amount ($)"
            placeholder="0.00"
            value={form.amount}
            onChangeText={update('amount')}
            error={errors.amount}
            keyboardType="decimal-pad"
          />
          <Input
            label="Reason"
            placeholder="Why was it lent?"
            value={form.reason}
            onChangeText={update('reason')}
            error={errors.reason}
            autoCapitalize="sentences"
          />
          <Input
            label="Date"
            placeholder="YYYY-MM-DD"
            value={form.date}
            onChangeText={update('date')}
            error={errors.date}
          />
          <Input
            label="Notes (optional)"
            placeholder="Any additional notes..."
            value={form.notes}
            onChangeText={update('notes')}
            multiline
            numberOfLines={3}
            style={{ minHeight: 80, textAlignVertical: 'top' }}
          />

          <Button title="Add Debt" onPress={handleSubmit} loading={loading} size="lg" style={styles.submitBtn} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  content: { padding: 24, gap: 18 },
  errorBanner: { padding: 14, borderRadius: 12, marginBottom: 4 },
  errorBannerText: { fontSize: 13, fontWeight: '600' },
  submitBtn: { marginTop: 8 },
});
