import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderLight: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  tabBar: string;
  card: string;
  shadow: string;
}

interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceSecondary: '#F3F4F6',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#A78BFA',
  accent: '#EC4899',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  tabBar: '#FFFFFF',
  card: '#FFFFFF',
  shadow: '#000000',
};

const darkColors: ThemeColors = {
  background: '#111827',
  surface: '#1F2937',
  surfaceSecondary: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  border: '#374151',
  borderLight: '#4B5563',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  secondary: '#A78BFA',
  accent: '#EC4899',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  tabBar: '#1F2937',
  card: 'rgba(31, 41, 55, 0.6)',
  shadow: '#000000',
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('auto');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (mode === 'auto') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(mode === 'dark');
    }
  }, [mode, systemColorScheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'auto')) {
        setMode(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async (newMode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('themeMode', newMode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
    saveTheme(newMode);
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    saveTheme(newMode);
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
