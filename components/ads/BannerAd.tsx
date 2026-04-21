import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function BannerAd() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      <View style={[styles.inner, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
        <Text style={[styles.adLabel, { color: theme.textTertiary }]}>Ad</Text>
        <Text style={[styles.adText, { color: theme.textSecondary }]}>
          Advertisement Banner
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  inner: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  adLabel: {
    fontSize: 10,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'currentColor',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    textTransform: 'uppercase',
  },
  adText: { fontSize: 13 },
});
