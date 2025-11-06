import { Stack } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AppProvider } from '../contexts/AppContext';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../contexts/ThemeContext';

const RootLayoutNav = () => {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen 
          name="product/[id]" 
          options={{ 
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_right'
          }} 
        />
        <Stack.Screen 
          name="checkout" 
          options={{ 
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_bottom'
          }} 
        />
      </Stack>
    </>
  );
};

const RootLayout = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <RootLayoutNav />
      </AppProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
