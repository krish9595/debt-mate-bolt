import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Debt } from '@/types';

interface ActivityItemProps {
  debt: Debt;
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#D97706',
  partial: '#0284C7',
  paid: '#059669',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  partial: 'Partial',
  paid: 'Paid',
};

function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${month} ${day} • ${hours}:${mins}`;
  } catch {
    return dateString;
  }
}

export function ActivityItem({ debt }: ActivityItemProps) {
  const { theme } = useTheme();
  const color = STATUS_COLORS[debt.status] ?? theme.textSecondary;
  const initial = debt.contact_name.charAt(0).toUpperCase();
  const dateTime = formatDateTime(debt.date);

  return (
    <View style={[styles.container, { borderBottomColor: theme.borderLight, paddingHorizontal: 16 }]}>
      <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
        <Text style={[styles.avatarText, { color }]}>{initial}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {debt.contact_name}
        </Text>
        <Text style={[styles.reason, { color: theme.textSecondary }]} numberOfLines={1}>
          {debt.reason || 'No reason provided'}
        </Text>
        <Text style={[styles.dateTime, { color: theme.textTertiary }]}>
          {dateTime}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, { color: theme.text }]}>
          ${debt.amount.toFixed(2)}
        </Text>
        <View style={[styles.badge, { backgroundColor: color + '20' }]}>
          <Text style={[styles.badgeText, { color }]}>{STATUS_LABELS[debt.status]}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 16, fontWeight: '700' },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 14, fontWeight: '600' },
  reason: { fontSize: 12 },
  dateTime: { fontSize: 11, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 6, flexShrink: 0 },
  amount: { fontSize: 15, fontWeight: '700' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
});
