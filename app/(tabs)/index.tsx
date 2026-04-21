import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Clock, Users, Plus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useDebts } from '@/hooks/useDebts';
import { StatCard } from '@/components/overview/StatCard';
import { ActivityItem } from '@/components/overview/ActivityItem';
import { AddDebtModal } from '@/components/records/AddDebtModal';
import { BannerAd } from '@/components/ads/BannerAd';
import { Card } from '@/components/shared/Card';
import { Debt } from '@/types';

export default function OverviewScreen() {
  const { theme } = useTheme();
  const { debts, loading, fetchDebts, addDebt } = useDebts();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => { fetchDebts(); }, []);

  const stats = useMemo(() => {
    const totalLent = debts.reduce((s, d) => s + d.amount, 0);
    const pending = debts
      .filter((d) => d.status !== 'paid')
      .reduce((s, d) => s + (d.amount - d.paid_amount), 0);
    const contacts = new Set(debts.map((d) => d.contact_name)).size;
    return { totalLent, pending, contacts };
  }, [debts]);

  const renderHeader = () => (
    <View>
      <View style={styles.headerArea}>
        <Text style={[styles.greeting, { color: theme.textSecondary }]}>Welcome back</Text>
        <Text style={[styles.headline, { color: theme.text }]}>Your Debt Overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Lent"
          value={`$${stats.totalLent.toFixed(0)}`}
          gradientStart={theme.card1GradientStart}
          gradientEnd={theme.card1GradientEnd}
          icon={<TrendingUp size={24} color="#FFFFFF" strokeWidth={2.5} />}
        />
        <StatCard
          title="Pending Amount"
          value={`$${stats.pending.toFixed(0)}`}
          gradientStart={theme.card3GradientStart}
          gradientEnd={theme.card3GradientEnd}
          icon={<Clock size={24} color="#FFFFFF" strokeWidth={2.5} />}
        />
        <StatCard
          title="Total Contacts"
          value={`${stats.contacts}`}
          gradientStart={theme.card4GradientStart}
          gradientEnd={theme.card4GradientEnd}
          icon={<Users size={24} color="#FFFFFF" strokeWidth={2.5} />}
        />
      </View>

      <Card style={styles.activityCard}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
      </Card>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        No debt records yet. Add your first record in Records tab.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <FlatList
        data={debts}
        renderItem={({ item }) => <ActivityItem debt={item} />}
        keyExtractor={(item: Debt) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchDebts} tintColor={theme.primary} />}
        scrollIndicatorInsets={{ right: 1 }}
        contentContainerStyle={[styles.listContent, { paddingBottom: 80 }]}
      />
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: '#1D4ED8' }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#FFFFFF" strokeWidth={3} />
      </TouchableOpacity>
      <AddDebtModal visible={modalVisible} onClose={() => setModalVisible(false)} onSubmit={addDebt} />
      <BannerAd />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  headerArea: { gap: 6, marginBottom: 24 },
  greeting: { fontSize: 13, fontWeight: '500', letterSpacing: 0.3, textTransform: 'uppercase' },
  headline: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  statsGrid: { gap: 16, marginBottom: 24 },
  activityCard: { gap: 0 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12, letterSpacing: -0.3, paddingHorizontal: 16, paddingVertical: 12 },
  emptyState: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 24 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
