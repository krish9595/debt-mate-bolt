import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  size = 'md',
}: ButtonProps) {
  const { theme } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: theme.primary, text: '#FFFFFF', border: theme.primary };
      case 'secondary':
        return { bg: theme.surface, text: theme.text, border: theme.border };
      case 'danger':
        return { bg: theme.danger, text: '#FFFFFF', border: theme.danger };
      case 'success':
        return { bg: theme.success, text: '#FFFFFF', border: theme.success };
      case 'ghost':
        return { bg: 'transparent', text: theme.primary, border: 'transparent' };
    }
  };

  const colors = getColors();
  const sizeStyle = size === 'sm' ? styles.sm : size === 'lg' ? styles.lg : styles.md;
  const textSizeStyle = size === 'sm' ? styles.textSm : size === 'lg' ? styles.textLg : styles.textMd;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        sizeStyle,
        { backgroundColor: colors.bg, borderColor: colors.border },
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <Text style={[styles.text, textSizeStyle, { color: colors.text }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  sm: { paddingVertical: 9, paddingHorizontal: 16 },
  md: { paddingVertical: 16, paddingHorizontal: 24 },
  lg: { paddingVertical: 18, paddingHorizontal: 28 },
  text: { fontWeight: '800', letterSpacing: -0.2 },
  textSm: { fontSize: 13 },
  textMd: { fontSize: 16 },
  textLg: { fontSize: 18 },
  disabled: { opacity: 0.5 },
});
