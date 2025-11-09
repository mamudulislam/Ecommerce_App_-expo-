import { Stack, usePathname } from 'expo-router';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AppProvider } from '../contexts/AppContext';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../contexts/ThemeContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import LoginScreen from './login';

const RootLayoutNav = () => {
  const { isDark } = useTheme();
  
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password-otp" options={{ headerShown: false }} />
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
        <Stack.Screen 
          name="notifications" 
          options={{ 
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_right'
          }} 
        />
      </Stack>
    </>
  );
};

const AppLayout = () => {
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  const isAuthPage = ['/login', '/register', '/forgot-password', '/forgot-password-otp'].includes(pathname);

  if (!isLoggedIn && !isAuthPage) {
    return <LoginScreen />;
  }

  return <RootLayoutNav />;
}

const RootLayout = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppLayout />
        </ThemeProvider>
      </AuthProvider>
    </AppProvider>
  );
};

export default RootLayout;
