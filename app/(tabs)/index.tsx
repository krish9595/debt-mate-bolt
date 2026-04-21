import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Clock, CircleCheck as CheckCircle2, Users } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useDebts } from '@/hooks/useDebts';
import { StatCard } from '@/components/overview/StatCard';
import { ActivityItem } from '@/components/overview/ActivityItem';
import { BannerAd } from '@/components/ads/BannerAd';
import { Card } from '@/components/shared/Card';

export default function OverviewScreen() {
  const { theme } = useTheme();
  const { debts, loading, fetchDebts } = useDebts();

  useEffect(() => { fetchDebts(); }, []);

  const stats = useMemo(() => {
    const totalLent = debts.reduce((s, d) => s + d.amount, 0);
    const totalPaid = debts.reduce((s, d) => s + d.paid_amount, 0);
    const pending = debts
      .filter((d) => d.status !== 'paid')
      .reduce((s, d) => s + (d.amount - d.paid_amount), 0);
    const contacts = new Set(debts.map((d) => d.contact_name)).size;
    return { totalLent, totalPaid, pending, contacts };
  }, [debts]);

  const recentDebts = debts.slice(0, 10);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchDebts} tintColor={theme.primary} />}
      >
        <View style={styles.headerArea}>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back</Text>
          <Text style={[styles.headline, { color: theme.text }]}>Your Debt Overview</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Lent"
              value={`$${stats.totalLent.toFixed(0)}`}
              gradientStart={theme.card1GradientStart}
              gradientEnd={theme.card1GradientEnd}
              icon={<TrendingUp size={24} color="#FFFFFF" strokeWidth={2.5} />}
              style={styles.statCard}
            />
            <StatCard
              title="Pending Amount"
              value={`$${stats.pending.toFixed(0)}`}
              gradientStart={theme.card3GradientStart}
              gradientEnd={theme.card3GradientEnd}
              icon={<Clock size={24} color="#FFFFFF" strokeWidth={2.5} />}
              style={styles.statCard}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Returned"
              value={`$${stats.totalPaid.toFixed(0)}`}
              gradientStart={theme.card2GradientStart}
              gradientEnd={theme.card2GradientEnd}
              icon={<CheckCircle2 size={24} color="#FFFFFF" strokeWidth={2.5} />}
              style={styles.statCard}
            />
            <StatCard
              title="Total Contacts"
              value={`${stats.contacts}`}
              gradientStart={theme.card4GradientStart}
              gradientEnd={theme.card4GradientEnd}
              icon={<Users size={24} color="#FFFFFF" strokeWidth={2.5} />}
              style={styles.statCard}
            />
          </View>
        </View>

        <Card style={styles.activityCard}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
          {recentDebts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                No debt records yet. Add your first record in Records tab.
              </Text>
            </View>
          ) : (
            recentDebts.map((debt) => <ActivityItem key={debt.id} debt={debt} />)
          )}
        </Card>
      </ScrollView>
      <BannerAd />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 24, paddingBottom: 24 },
  headerArea: { gap: 6, paddingTop: 8 },
  greeting: { fontSize: 13, fontWeight: '500', letterSpacing: 0.3, textTransform: 'uppercase' },
  headline: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  statsGrid: { gap: 14 },
  statsRow: { flexDirection: 'row', gap: 14 },
  statCard: { flex: 1 },
  activityCard: { gap: 0 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12, letterSpacing: -0.3 },
  emptyState: { paddingVertical: 28, alignItems: 'center' },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
});
