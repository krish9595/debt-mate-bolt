import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { DollarSign } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';

type Mode = 'login' | 'signup';

export default function LoginScreen() {
  const { theme } = useTheme();
  const { signInWithEmail, signUpWithEmail, signInAnonymously } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [anonLoading, setAnonLoading] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim() || !email.includes('@')) e.email = 'Valid email required';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError(null);
    const err = mode === 'login'
      ? await signInWithEmail(email.trim(), password)
      : await signUpWithEmail(email.trim(), password);
    setLoading(false);
    if (err) {
      setServerError(err);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleAnonymous = async () => {
    setAnonLoading(true);
    setServerError(null);
    const err = await signInAnonymously();
    setAnonLoading(false);
    if (err) {
      setServerError(err);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoArea}>
          <View style={[styles.logoIcon, { backgroundColor: theme.primary }]}>
            <DollarSign size={32} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={[styles.appName, { color: theme.text }]}>Debt Mate</Text>
          <Text style={[styles.tagline, { color: theme.textSecondary }]}>
            Track what you lend, never forget
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border, shadowColor: theme.shadow }]}>
          <View style={[styles.modeToggle, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
            {(['login', 'signup'] as Mode[]).map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.modeBtn,
                  mode === m && { backgroundColor: theme.surface, shadowColor: theme.shadow },
                ]}
                onPress={() => { setMode(m); setErrors({}); setServerError(null); }}
                activeOpacity={0.75}
              >
                <Text style={[styles.modeBtnText, { color: mode === m ? theme.text : theme.textSecondary }]}>
                  {m === 'login' ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {serverError && (
            <View style={[styles.errorBanner, { backgroundColor: theme.dangerLight }]}>
              <Text style={[styles.errorText, { color: theme.danger }]}>{serverError}</Text>
            </View>
          )}

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />
          <Input
            label="Password"
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined })); }}
            secureTextEntry
            error={errors.password}
          />

          <Button
            title={mode === 'login' ? 'Sign In' : 'Create Account'}
            onPress={handleSubmit}
            loading={loading}
            size="lg"
          />

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textTertiary }]}>or</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <Button
            title="Continue as Guest"
            onPress={handleAnonymous}
            loading={anonLoading}
            variant="secondary"
            size="lg"
          />
        </View>

        <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
          By continuing, you agree to our terms of service
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 24,
  },
  logoArea: { alignItems: 'center', gap: 12 },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: 32, fontWeight: '800', letterSpacing: -0.5 },
  tagline: { fontSize: 15, textAlign: 'center' },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
    gap: 16,
  },
  modeToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  modeBtnText: { fontSize: 14, fontWeight: '600' },
  errorBanner: { padding: 12, borderRadius: 10 },
  errorText: { fontSize: 13, fontWeight: '500' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },
  disclaimer: { fontSize: 12, textAlign: 'center' },
});
