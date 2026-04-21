import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ChevronDown, ChevronUp, CreditCard, CircleCheck as CheckCircle, Trash2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Debt } from '@/types';

interface DebtCardProps {
  debt: Debt;
  onAddPayment: () => void;
  onMarkPaid: () => void;
  onDelete: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  partial: '#2563EB',
  paid: '#10B981',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  partial: 'Partial',
  paid: 'Paid',
};

export function DebtCard({ debt, onAddPayment, onMarkPaid, onDelete }: DebtCardProps) {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const color = STATUS_COLORS[debt.status] ?? theme.textSecondary;
  const remaining = debt.amount - debt.paid_amount;
  const progress = debt.amount > 0 ? debt.paid_amount / debt.amount : 0;
  const initial = debt.contact_name.charAt(0).toUpperCase();

  const confirmDelete = () => {
    Alert.alert('Delete Debt', `Delete debt for ${debt.contact_name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, shadowColor: theme.shadow, borderColor: theme.border },
      ]}
    >
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.85}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
            <Text style={[styles.avatarText, { color }]}>{initial}</Text>
          </View>
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]}>{debt.contact_name}</Text>
            <Text style={[styles.date, { color: theme.textSecondary }]}>
              {new Date(debt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <View style={styles.right}>
            <Text style={[styles.amount, { color: theme.text }]}>${debt.amount.toFixed(2)}</Text>
            <View style={[styles.badge, { backgroundColor: color + '18' }]}>
              <Text style={[styles.badgeText, { color }]}>{STATUS_LABELS[debt.status]}</Text>
            </View>
          </View>
          <View style={styles.chevron}>
            {expanded
              ? <ChevronUp size={16} color={theme.textTertiary} />
              : <ChevronDown size={16} color={theme.textTertiary} />}
          </View>
        </View>

        {debt.reason ? (
          <Text style={[styles.reason, { color: theme.textSecondary }]} numberOfLines={expanded ? undefined : 1}>
            {debt.reason}
          </Text>
        ) : null}

        <View style={styles.progressBar}>
          <View style={[styles.progressBg, { backgroundColor: theme.border }]}>
            <View style={[styles.progressFill, { backgroundColor: color, width: `${Math.min(progress * 100, 100)}%` }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.textTertiary }]}>
            ${debt.paid_amount.toFixed(2)} / ${debt.amount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expanded}>
          {debt.notes ? (
            <View style={[styles.notesBox, { backgroundColor: theme.surfaceSecondary, borderColor: theme.borderLight }]}>
              <Text style={[styles.notesLabel, { color: theme.textSecondary }]}>Notes</Text>
              <Text style={[styles.notesText, { color: theme.text }]}>{debt.notes}</Text>
            </View>
          ) : null}

          {remaining > 0 && (
            <Text style={[styles.remaining, { color: theme.textSecondary }]}>
              Remaining: <Text style={[styles.remainingAmount, { color: theme.danger }]}>${remaining.toFixed(2)}</Text>
            </Text>
          )}

          <View style={styles.actions}>
            {debt.status !== 'paid' && (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primary + '40' }]}
                  onPress={onAddPayment}
                  activeOpacity={0.75}
                >
                  <CreditCard size={14} color={theme.primary} />
                  <Text style={[styles.actionText, { color: theme.primary }]}>Add Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: theme.successLight, borderColor: theme.success + '40' }]}
                  onPress={onMarkPaid}
                  activeOpacity={0.75}
                >
                  <CheckCircle size={14} color={theme.success} />
                  <Text style={[styles.actionText, { color: theme.success }]}>Mark Paid</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.dangerLight, borderColor: theme.danger + '40' }]}
              onPress={confirmDelete}
              activeOpacity={0.75}
            >
              <Trash2 size={14} color={theme.danger} />
              <Text style={[styles.actionText, { color: theme.danger }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
  date: { fontSize: 12, marginTop: 3 },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { fontSize: 17, fontWeight: '800' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  chevron: { marginLeft: 6 },
  reason: { fontSize: 13, marginBottom: 12, marginLeft: 60, fontWeight: '500' },
  progressBar: { marginTop: 6 },
  progressBg: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 12, fontWeight: '500' },
  expanded: { marginTop: 14, gap: 12 },
  notesBox: { padding: 14, borderRadius: 12, borderWidth: 1, gap: 6 },
  notesLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  notesText: { fontSize: 13, lineHeight: 20 },
  remaining: { fontSize: 13, fontWeight: '500' },
  remainingAmount: { fontWeight: '800' },
  actions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  actionText: { fontSize: 13, fontWeight: '700' },
});
