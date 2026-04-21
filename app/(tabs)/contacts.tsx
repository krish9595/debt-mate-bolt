import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useDebts } from '@/hooks/useDebts';
import { ContactCard } from '@/components/contacts/ContactCard';
import { BannerAd } from '@/components/ads/BannerAd';
import { ContactSummary } from '@/types';
import { useState } from 'react';

export default function ContactsScreen() {
  const { theme } = useTheme();
  const { debts, loading, fetchDebts } = useDebts();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchDebts(); }, []);

  const contacts = useMemo<ContactSummary[]>(() => {
    const map = new Map<string, ContactSummary>();
    for (const d of debts) {
      const existing = map.get(d.contact_name);
      if (existing) {
        existing.totalLent += d.amount;
        existing.totalPaid += d.paid_amount;
        existing.outstanding += d.amount - d.paid_amount;
        existing.debtCount += 1;
      } else {
        map.set(d.contact_name, {
          name: d.contact_name,
          totalLent: d.amount,
          totalPaid: d.paid_amount,
          outstanding: d.amount - d.paid_amount,
          debtCount: 1,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.outstanding - a.outstanding);
  }, [debts]);

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts;
    const q = search.toLowerCase();
    return contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [contacts, search]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Contacts</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {contacts.length} {contacts.length === 1 ? 'person' : 'people'}
        </Text>
      </View>

      <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Search size={16} color={theme.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search contacts..."
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

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => <ContactCard contact={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchDebts} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              {search ? 'No contacts found' : 'No contacts yet'}
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              {search
                ? 'Try a different search'
                : 'Contacts appear here when you add debt records'}
            </Text>
          </View>
        }
      />

      <BannerAd />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 2,
  },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, padding: 0 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  emptyState: { paddingTop: 60, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
});
