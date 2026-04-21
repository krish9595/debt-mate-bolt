import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useDebts } from '@/hooks/useDebts';
import { DebtCard } from '@/components/records/DebtCard';
import { AddDebtModal } from '@/components/records/AddDebtModal';
import { PaymentModal } from '@/components/records/PaymentModal';
import { BannerAd } from '@/components/ads/BannerAd';
import { Debt } from '@/types';

type FilterTab = 'all' | 'pending' | 'partial' | 'paid';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'partial', label: 'Partial' },
  { key: 'paid', label: 'Paid' },
];

export default function RecordsScreen() {
  const { theme } = useTheme();
  const { debts, loading, fetchDebts, addDebt, addPayment, markAsPaid, deleteDebt } = useDebts();
  const [showAdd, setShowAdd] = useState(false);
  const [paymentDebt, setPaymentDebt] = useState<Debt | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');

  useEffect(() => { fetchDebts(); }, []);

  const filtered = useMemo(() => {
    let list = debts;
    if (filter !== 'all') list = list.filter((d) => d.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.contact_name.toLowerCase().includes(q) ||
          d.reason.toLowerCase().includes(q) ||
          d.notes.toLowerCase().includes(q)
      );
    }
    return list;
  }, [debts, filter, search]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Records</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => setShowAdd(true)}
          activeOpacity={0.85}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.addBtnText}>Add Debt</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Search size={16} color={theme.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search by name, reason..."
          placeholderTextColor={theme.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <X size={16} color={theme.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        {FILTER_TABS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterTab,
              {
                backgroundColor: filter === key ? theme.primary : theme.surface,
                borderColor: filter === key ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setFilter(key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterTabText,
                { color: filter === key ? '#FFFFFF' : theme.textSecondary },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DebtCard
            debt={item}
            onAddPayment={() => setPaymentDebt(item)}
            onMarkPaid={() => markAsPaid(item.id)}
            onDelete={() => deleteDebt(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchDebts}
        refreshing={loading}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {search ? 'No results found' : 'No debt records'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              {search ? 'Try a different search term' : 'Tap "Add Debt" to record your first entry'}
            </Text>
          </View>
        }
      />

      <BannerAd />

      <AddDebtModal visible={showAdd} onClose={() => setShowAdd(false)} onSubmit={addDebt} />
      <PaymentModal
        visible={paymentDebt !== null}
        debt={paymentDebt}
        onClose={() => setPaymentDebt(null)}
        onSubmit={(amount) => addPayment(paymentDebt!.id, amount)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterTabText: { fontSize: 13, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  emptyState: { paddingTop: 60, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
});
