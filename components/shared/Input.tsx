import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, ...props }: InputProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surfaceSecondary,
            borderColor: error ? theme.danger : theme.border,
            color: theme.text,
          },
        ]}
        placeholderTextColor={theme.textTertiary}
        {...props}
      />
      {error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 0.3, textTransform: 'capitalize' },
  input: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1.5,
    fontWeight: '500',
  },
  error: { fontSize: 12, marginTop: 4, fontWeight: '600' },
});
