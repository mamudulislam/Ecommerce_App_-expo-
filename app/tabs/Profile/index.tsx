/**
 * ProfileTab – Fully customized user profile screen
 * Expo + React-Native + TypeScript + Dark Theme
 * Matches the entire app design: Dark slate + purple accents
 * Features: Avatar, stats, settings list, logout, dark mode toggle
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const AVATAR_SIZE = 100;

/* ────────────────────── Mock User Data ────────────────────── */
const user = {
  name: 'John William',
  email: 'john.william@example.com',
  avatar: 'https://placehold.co/200x200/6366f1/ffffff?text=JW',
  stats: {
    orders: 24,
    wishlist: 8,
    reviews: 12,
  },
};

/* ────────────────────── Reusable Components ────────────────────── */
const ProfileHeader = () => {
  const scaleAnim = useState(new Animated.Value(1))[0];

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={s.header}>
      <TouchableOpacity activeOpacity={0.9} onPress={animatePress}>
        <Animated.View style={[s.avatarWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <Image source={{ uri: user.avatar }} style={s.avatar} />
          <View style={s.editOverlay}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Text style={s.name}>{user.name}</Text>
      <Text style={s.email}>{user.email}</Text>

      <View style={s.statsRow}>
        <View style={s.statItem}>
          <Text style={s.statValue}>{user.stats.orders}</Text>
          <Text style={s.statLabel}>Orders</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statItem}>
          <Text style={s.statValue}>{user.stats.wishlist}</Text>
          <Text style={s.statLabel}>Wishlist</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statItem}>
          <Text style={s.statValue}>{user.stats.reviews}</Text>
          <Text style={s.statLabel}>Reviews</Text>
        </View>
      </View>
    </View>
  );
};

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SettingsItem: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}> = ({ icon, title, subtitle, onPress, right }) => (
  <TouchableOpacity style={s.settingsItem} onPress={onPress} activeOpacity={0.7}>
    <View style={s.settingsLeft}>
      <View style={s.iconWrapper}>
        <Ionicons name={icon} size={22} color="#6366f1" />
      </View>
      <View>
        <Text style={s.settingsTitle}>{title}</Text>
        {subtitle && <Text style={s.settingsSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={s.settingsRight}>
      {right || <Ionicons name="chevron-forward" size={20} color="#6b7280" />}
    </View>
  </TouchableOpacity>
);

const LogoutButton = () => {
  const fadeAnim = useState(new Animated.Value(1))[0];

  const handlePress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.8,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      // In real app: trigger logout
      console.log('Logging out...');
    });
  };

  return (
    <TouchableOpacity style={s.logoutBtn} onPress={handlePress}>
      <Animated.View style={[s.logoutInner, { opacity: fadeAnim }]}>
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        <Text style={s.logoutText}>Log Out</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function ProfileTab() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        <ProfileHeader />

        <SettingsSection title="Account">
          <SettingsItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal info"
          />
          <SettingsItem
            icon="location-outline"
            title="Shipping Addresses"
            subtitle="Manage delivery locations"
          />
          <SettingsItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Saved cards and wallets"
          />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingsItem
            icon="notifications-outline"
            title="Push Notifications"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#374151', true: '#6366f1' }}
                thumbColor={notifications ? '#a78bfa' : '#6b7280'}
              />
            }
          />
          <SettingsItem
            icon="moon-outline"
            title="Dark Mode"
            right={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#374151', true: '#6366f1' }}
                thumbColor={darkMode ? '#a78bfa' : '#6b7280'}
              />
            }
          />
          <SettingsItem icon="globe-outline" title="Language" subtitle="English (US)" />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem icon="help-circle-outline" title="Help & FAQ" />
          <SettingsItem icon="shield-checkmark-outline" title="Privacy Policy" />
          <SettingsItem icon="document-text-outline" title="Terms of Service" />
        </SettingsSection>

        <LogoutButton />
      </ScrollView>
    </View>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  scrollContent: { padding: 20, paddingBottom: 40 },

  /* Header */
  header: { alignItems: 'center', marginBottom: 32 },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
    borderColor: '#6366f1',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366f1',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#111827',
  },
  name: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 4 },
  email: { fontSize: 14, color: '#9ca3af', marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#a78bfa' },
  statLabel: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#374151' },

  /* Section */
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Settings Item */
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: {
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  settingsTitle: { fontSize: 16, fontWeight: '600', color: '#e5e7eb' },
  settingsSubtitle: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  settingsRight: { flexDirection: 'row', alignItems: 'center' },

  /* Logout */
  logoutBtn: { marginTop: 20, alignSelf: 'center' },
  logoutInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutText: { color: '#ef4444', fontWeight: '600', fontSize: 16, marginLeft: 8 },
});