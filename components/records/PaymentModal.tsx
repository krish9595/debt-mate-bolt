import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { Debt } from '@/types';

interface PaymentModalProps {
  visible: boolean;
  debt: Debt | null;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<string | null>;
}

const QUICK_AMOUNTS = [50, 100, 500];

export function PaymentModal({ visible, debt, onClose, onSubmit }: PaymentModalProps) {
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!debt) return null;

  const remaining = debt.amount - debt.paid_amount;

  const handleQuick = (val: number) => {
    const capped = Math.min(val, remaining);
    setAmount(capped.toFixed(2));
    setError(null);
  };

  const handleFull = () => {
    setAmount(remaining.toFixed(2));
    setError(null);
  };

  const handleSubmit = async () => {
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (num > remaining) {
      setError(`Cannot exceed remaining amount $${remaining.toFixed(2)}`);
      return;
    }
    setLoading(true);
    setServerError(null);
    const err = await onSubmit(num);
    setLoading(false);
    if (err) {
      setServerError(err);
    } else {
      setAmount('');
      setError(null);
      onClose();
    }
  };

  const handleClose = () => {
    setAmount('');
    setError(null);
    setServerError(null);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="formSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={[theme.successGradientStart, theme.successGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <Text style={styles.title}>Add Payment</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <X size={20} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.debtInfo, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.debtRow}>
              <Text style={[styles.debtLabel, { color: theme.textSecondary }]}>Contact</Text>
              <Text style={[styles.debtValue, { color: theme.text }]}>{debt.contact_name}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
            <View style={styles.debtRow}>
              <Text style={[styles.debtLabel, { color: theme.textSecondary }]}>Total Amount</Text>
              <Text style={[styles.debtValue, { color: theme.text }]}>${debt.amount.toFixed(2)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
            <View style={styles.debtRow}>
              <Text style={[styles.debtLabel, { color: theme.textSecondary }]}>Paid So Far</Text>
              <Text style={[styles.debtValue, { color: theme.success }]}>${debt.paid_amount.toFixed(2)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
            <View style={styles.debtRow}>
              <Text style={[styles.debtLabel, { color: theme.textSecondary }]}>Remaining</Text>
              <Text style={[styles.debtValue, { color: theme.danger, fontSize: 18, fontWeight: '700' }]}>
                ${remaining.toFixed(2)}
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Quick Amounts</Text>
          <View style={styles.quickRow}>
            {QUICK_AMOUNTS.map((q) => (
              <TouchableOpacity
                key={q}
                style={[
                  styles.quickBtn,
                  {
                    backgroundColor: q <= remaining ? theme.primaryLight : theme.surfaceSecondary,
                    borderColor: q <= remaining ? theme.primary + '40' : theme.border,
                  },
                ]}
                onPress={() => handleQuick(q)}
                disabled={q > remaining}
                activeOpacity={0.75}
              >
                <Text style={[styles.quickText, { color: q <= remaining ? theme.primary : theme.textTertiary }]}>
                  ${q}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: theme.successLight, borderColor: theme.success + '40' }]}
              onPress={handleFull}
              activeOpacity={0.75}
            >
              <Text style={[styles.quickText, { color: theme.success }]}>Full</Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Payment Amount ($)"
            placeholder="0.00"
            value={amount}
            onChangeText={(v) => { setAmount(v); setError(null); }}
            keyboardType="decimal-pad"
            error={error ?? undefined}
          />

          {serverError && (
            <View style={[styles.errorBanner, { backgroundColor: theme.dangerLight }]}>
              <Text style={[styles.errorText, { color: theme.danger }]}>{serverError}</Text>
            </View>
          )}

          <Button title="Record Payment" onPress={handleSubmit} loading={loading} size="lg" />
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
  debtInfo: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  debtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  debtLabel: { fontSize: 12, fontWeight: '600' },
  debtValue: { fontSize: 16, fontWeight: '700' },
  divider: { height: 1 },
  sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  quickRow: { flexDirection: 'row', gap: 12 },
  quickBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  quickText: { fontSize: 14, fontWeight: '800' },
  errorBanner: { padding: 14, borderRadius: 12 },
  errorText: { fontSize: 13, fontWeight: '600' },
});
