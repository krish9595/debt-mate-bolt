import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Moon,
  Sun,
  LogOut,
  DollarSign,
  Shield,
  Bell,
  Info,
  ChevronRight,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/shared/Card';

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingRow({ icon, label, value, onPress, rightElement, danger }: SettingRowProps) {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: theme.borderLight }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !rightElement}
    >
      <View style={[styles.rowIcon, { backgroundColor: danger ? theme.dangerLight : theme.surfaceSecondary }]}>
        {icon}
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowLabel, { color: danger ? theme.danger : theme.text }]}>{label}</Text>
        {value && <Text style={[styles.rowValue, { color: theme.textSecondary }]}>{value}</Text>}
      </View>
      {rightElement ?? (onPress && <ChevronRight size={16} color={theme.textTertiary} />)}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const isAnon = user?.is_anonymous ?? false;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

        <View style={styles.profileSection}>
          <View style={[styles.profileAvatar, { backgroundColor: theme.primaryLight }]}>
            <DollarSign size={28} color={theme.primary} />
          </View>
          <View>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {isAnon ? 'Guest User' : (user?.email ?? 'User')}
            </Text>
            <Text style={[styles.profileBadge, { color: theme.textSecondary }]}>
              {isAnon ? 'Anonymous account' : 'Signed in'}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: theme.textTertiary }]}>Appearance</Text>
        <Card style={styles.cardSection}>
          <SettingRow
            icon={isDark ? <Moon size={18} color={theme.primary} /> : <Sun size={18} color={theme.warning} />}
            label={isDark ? 'Dark Mode' : 'Light Mode'}
            value="Toggle theme"
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary + '80' }}
                thumbColor={isDark ? theme.primary : '#FFFFFF'}
              />
            }
          />
        </Card>

        <Text style={[styles.sectionLabel, { color: theme.textTertiary }]}>Account</Text>
        <Card style={styles.cardSection}>
          <SettingRow
            icon={<Shield size={18} color={theme.success} />}
            label="Data & Privacy"
            value="Your data is stored securely"
          />
          <SettingRow
            icon={<Bell size={18} color={theme.warning} />}
            label="Notifications"
            value="Coming soon"
          />
          <SettingRow
            icon={<Info size={18} color={theme.primary} />}
            label="About Debt Mate"
            value="Version 1.0.0"
          />
        </Card>

        <Text style={[styles.sectionLabel, { color: theme.textTertiary }]}>Danger Zone</Text>
        <Card style={styles.cardSection}>
          <SettingRow
            icon={<LogOut size={18} color={theme.danger} />}
            label="Sign Out"
            onPress={handleSignOut}
            danger
          />
        </Card>

        {isAnon && (
          <View style={[styles.anonBanner, { backgroundColor: theme.warningLight, borderColor: theme.warning + '40' }]}>
            <Text style={[styles.anonTitle, { color: theme.warning }]}>Guest Account</Text>
            <Text style={[styles.anonText, { color: theme.text }]}>
              Your data may be lost if you sign out. Create an account to keep your records safe.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, paddingTop: 8, marginBottom: 8 },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: { fontSize: 17, fontWeight: '700' },
  profileBadge: { fontSize: 13, marginTop: 2 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  cardSection: { padding: 0, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowValue: { fontSize: 12 },
  anonBanner: {
    borderRadius: 14,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    marginTop: 4,
  },
  anonTitle: { fontSize: 14, fontWeight: '700' },
  anonText: { fontSize: 13, lineHeight: 20 },
});
