import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ContactSummary } from '@/types';

interface ContactCardProps {
  contact: ContactSummary;
}

const AVATAR_COLORS = [
  '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#0891B2', '#EA580C',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function ContactCard({ contact }: ContactCardProps) {
  const { theme } = useTheme();
  const color = getAvatarColor(contact.name);
  const initial = contact.name.charAt(0).toUpperCase();
  const pct = contact.totalLent > 0 ? (contact.totalPaid / contact.totalLent) * 100 : 0;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.surface, shadowColor: theme.shadow, borderColor: theme.border },
      ]}
    >
      <View style={styles.top}>
        <View style={[styles.avatar, { backgroundColor: color + '20' }]}>
          <Text style={[styles.avatarText, { color }]}>{initial}</Text>
        </View>
        <View style={styles.nameArea}>
          <Text style={[styles.name, { color: theme.text }]}>{contact.name}</Text>
          <Text style={[styles.debtCount, { color: theme.textSecondary }]}>
            {contact.debtCount} {contact.debtCount === 1 ? 'debt' : 'debts'}
          </Text>
        </View>
        <View style={styles.amounts}>
          <Text style={[styles.outstanding, { color: contact.outstanding > 0 ? theme.danger : theme.success }]}>
            ${contact.outstanding.toFixed(2)}
          </Text>
          <Text style={[styles.outstandingLabel, { color: theme.textTertiary }]}>
            {contact.outstanding > 0 ? 'outstanding' : 'settled'}
          </Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={[styles.progressBg, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: pct >= 100 ? theme.success : color, width: `${Math.min(pct, 100)}%` },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text style={[styles.progressSmall, { color: theme.textTertiary }]}>
            Paid ${contact.totalPaid.toFixed(2)}
          </Text>
          <Text style={[styles.progressSmall, { color: theme.textTertiary }]}>
            Total ${contact.totalLent.toFixed(2)}
          </Text>
        </View>
      </View>
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
    gap: 14,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 20, fontWeight: '800' },
  nameArea: { flex: 1 },
  name: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  debtCount: { fontSize: 12, marginTop: 3, fontWeight: '500' },
  amounts: { alignItems: 'flex-end' },
  outstanding: { fontSize: 18, fontWeight: '800' },
  outstandingLabel: { fontSize: 11, marginTop: 3, fontWeight: '600' },
  progressSection: { gap: 8 },
  progressBg: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressSmall: { fontSize: 12, fontWeight: '500' },
});
