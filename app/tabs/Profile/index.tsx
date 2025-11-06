import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

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
  const { colors } = useTheme();
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
          <Image source={{ uri: user.avatar }} style={[s.avatar, { borderColor: colors.primary }]} />
          <View style={[s.editOverlay, { backgroundColor: colors.primary }]}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </Animated.View>
      </TouchableOpacity>

      <Text style={[s.name, { color: colors.text }]}>{user.name}</Text>
      <Text style={[s.email, { color: colors.textSecondary }]}>{user.email}</Text>

      <View style={[s.statsRow, { 
        backgroundColor: colors.card,
        borderColor: colors.borderLight 
      }]}>
        <View style={s.statItem}>
          <Text style={[s.statValue, { color: colors.primary }]}>{user.stats.orders}</Text>
          <Text style={[s.statLabel, { color: colors.textSecondary }]}>Orders</Text>
        </View>
        <View style={[s.statDivider, { backgroundColor: colors.border }]} />
        <View style={s.statItem}>
          <Text style={[s.statValue, { color: colors.primary }]}>{user.stats.wishlist}</Text>
          <Text style={[s.statLabel, { color: colors.textSecondary }]}>Wishlist</Text>
        </View>
        <View style={[s.statDivider, { backgroundColor: colors.border }]} />
        <View style={s.statItem}>
          <Text style={[s.statValue, { color: colors.primary }]}>{user.stats.reviews}</Text>
          <Text style={[s.statLabel, { color: colors.textSecondary }]}>Reviews</Text>
        </View>
      </View>
    </View>
  );
};

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  const { colors } = useTheme();
  return (
    <View style={s.section}>
      <Text style={[s.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      {children}
    </View>
  );
};

const SettingsItem: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}> = ({ icon, title, subtitle, onPress, right }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[s.settingsItem, { 
        backgroundColor: colors.card,
        borderColor: colors.borderLight 
      }]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={s.settingsLeft}>
        <View style={[s.iconWrapper, { backgroundColor: colors.surface }]}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View>
          <Text style={[s.settingsTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[s.settingsSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={s.settingsRight}>
        {right || <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  );
};

const LogoutButton = () => {
  const { colors } = useTheme();
  const fadeAnim = useState(new Animated.Value(1))[0];

  const handlePress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.8,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      console.log('Logging out...');
    });
  };

  return (
    <TouchableOpacity style={s.logoutBtn} onPress={handlePress}>
      <Animated.View style={[s.logoutInner, { 
        backgroundColor: colors.surface,
        borderColor: colors.error,
        opacity: fadeAnim 
      }]}>
        <Ionicons name="log-out-outline" size={22} color={colors.error} />
        <Text style={[s.logoutText, { color: colors.error }]}>Log Out</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function ProfileTab() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
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
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={notifications ? colors.primaryLight : colors.textTertiary}
              />
            }
          />
          <SettingsItem
            icon="moon-outline"
            title="Dark Mode"
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDark ? colors.primaryLight : colors.textTertiary}
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
    </SafeAreaView>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  container: { flex: 1 },
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
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  name: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  email: { fontSize: 14, marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  statDivider: { width: 1 },

  /* Section */
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Settings Item */
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
  },
  settingsLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: {
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  settingsTitle: { fontSize: 16, fontWeight: '600' },
  settingsSubtitle: { fontSize: 12, marginTop: 2 },
  settingsRight: { flexDirection: 'row', alignItems: 'center' },

  /* Logout */
  logoutBtn: { marginTop: 20, alignSelf: 'center' },
  logoutInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  logoutText: { fontWeight: '600', fontSize: 16, marginLeft: 8 },
});