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
  Alert,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAuth } from '../../../contexts/AuthContext';

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
  const router = useRouter();

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleAvatarPress = () => {
    animatePress();
    // Add avatar change functionality here
    Alert.alert('Change Avatar', 'Would you like to change your profile picture?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Choose Photo', onPress: () => console.log('Choose photo') },
      { text: 'Take Photo', onPress: () => console.log('Take photo') },
    ]);
  };

  const handleStatPress = (statType: string) => {
    switch (statType) {
      case 'orders':
        router.push('/orders');
        break;
      case 'wishlist':
        router.push('/wishlist');
        break;
      case 'reviews':
        router.push('/reviews');
        break;
    }
  };

  return (
    <View style={s.header}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={handleAvatarPress}
        style={s.avatarTouchable}
      >
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
        borderColor: colors.borderLight,
        shadowColor: colors.shadow || '#000',
      }]}>
        <TouchableOpacity 
          style={s.statItem} 
          onPress={() => handleStatPress('orders')}
          activeOpacity={0.7}
        >
          <Text style={[s.statValue, { color: colors.primary }]}>{user.stats.orders}</Text>
          <Text style={[s.statLabel, { color: colors.textSecondary }]}>Orders</Text>
        </TouchableOpacity>
        
        <View style={[s.statDivider, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity 
          style={s.statItem} 
          onPress={() => handleStatPress('wishlist')}
          activeOpacity={0.7}
        >
          <Text style={[s.statValue, { color: colors.primary }]}>{user.stats.wishlist}</Text>
          <Text style={[s.statLabel, { color: colors.textSecondary }]}>Wishlist</Text>
        </TouchableOpacity>
        
        <View style={[s.statDivider, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity 
          style={s.statItem} 
          onPress={() => handleStatPress('reviews')}
          activeOpacity={0.7}
        >
          <Text style={[s.statValue, { color: colors.primary }]}>{user.stats.reviews}</Text>
          <Text style={[s.statLabel, { color: colors.textSecondary }]}>Reviews</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SettingsSection: React.FC<{ 
  title: string; 
  children: React.ReactNode;
  last?: boolean;
}> = ({ title, children, last }) => {
  const { colors } = useTheme();
  return (
    <View style={[s.section, last && s.lastSection]}>
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
  showChevron?: boolean;
}> = ({ icon, title, subtitle, onPress, right, showChevron = true }) => {
  const { colors } = useTheme();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity 
      style={[s.settingsItem, { 
        backgroundColor: colors.card,
        borderColor: colors.borderLight,
        shadowColor: colors.shadow || '#000',
      }]} 
      onPress={handlePress} 
      activeOpacity={0.7}
      disabled={!onPress && !right}
    >
      <View style={s.settingsLeft}>
        <View style={[s.iconWrapper, { backgroundColor: `${colors.primary}15` }]}>
          <Ionicons name={icon} size={22} color={colors.primary} />
        </View>
        <View style={s.textContainer}>
          <Text style={[s.settingsTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[s.settingsSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={s.settingsRight}>
        {right || (showChevron && (
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const LogoutButton = () => {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const fadeAnim = useState(new Animated.Value(1))[0];

  const handlePress = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.8,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Log Out', 
            style: 'destructive',
            onPress: () => {
              console.log('Logging out...');
              logout();
            }
          },
        ]
      );
    });
  };

  return (
    <TouchableOpacity 
      style={s.logoutBtn} 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View style={[s.logoutInner, { 
        backgroundColor: `${colors.error}15`,
        borderColor: colors.error,
        opacity: fadeAnim,
        shadowColor: colors.shadow || '#000',
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
  const [biometric, setBiometric] = useState(false);
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleShippingAddresses = () => {
    router.push('/addresses');
  };

  const handlePaymentMethods = () => {
    router.push('/payment-methods');
  };

  const handleLanguage = () => {
    Alert.alert('Language', 'Language selection coming soon!');
  };

  const handleHelpFAQ = () => {
    router.push('/help');
  };

  const handlePrivacyPolicy = () => {
    router.push('/privacy');
  };

  const handleTerms = () => {
    router.push('/terms');
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={s.scrollContent}
        bounces={true}
      >
        <ProfileHeader />

        <SettingsSection title="Account">
          <SettingsItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal info"
            onPress={handleEditProfile}
          />
          <SettingsItem
            icon="location-outline"
            title="Shipping Addresses"
            subtitle="Manage delivery locations"
            onPress={handleShippingAddresses}
          />
          <SettingsItem
            icon="card-outline"
            title="Payment Methods"
            subtitle="Saved cards and wallets"
            onPress={handlePaymentMethods}
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
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={notifications ? colors.primary : colors.textTertiary}
                ios_backgroundColor={colors.border}
              />
            }
            showChevron={false}
          />
          <SettingsItem
            icon="moon-outline"
            title="Dark Mode"
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={isDark ? colors.primary : colors.textTertiary}
                ios_backgroundColor={colors.border}
              />
            }
            showChevron={false}
          />
          <SettingsItem
            icon="finger-print-outline"
            title="Biometric Login"
            right={
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                thumbColor={biometric ? colors.primary : colors.textTertiary}
                ios_backgroundColor={colors.border}
              />
            }
            showChevron={false}
          />
          <SettingsItem 
            icon="globe-outline" 
            title="Language" 
            subtitle="English (US)" 
            onPress={handleLanguage}
          />
        </SettingsSection>

        <SettingsSection title="Support" last={true}>
          <SettingsItem 
            icon="help-circle-outline" 
            title="Help & FAQ" 
            onPress={handleHelpFAQ}
          />
          <SettingsItem 
            icon="shield-checkmark-outline" 
            title="Privacy Policy" 
            onPress={handlePrivacyPolicy}
          />
          <SettingsItem 
            icon="document-text-outline" 
            title="Terms of Service" 
            onPress={handleTerms}
          />
        </SettingsSection>

        <LogoutButton />
        
        <View style={s.versionContainer}>
          <Text style={[s.versionText, { color: colors.textTertiary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 20,
    paddingTop: 10,
  },

  /* Header */
  header: { 
    alignItems: 'center', 
    marginBottom: 32,
    paddingTop: 10,
  },
  avatarTouchable: {
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 4,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  email: { 
    fontSize: 16, 
    marginBottom: 24,
    opacity: 0.7,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    width: '100%',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: { 
    flex: 1, 
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: { 
    fontSize: 20, 
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: { 
    fontSize: 13, 
    fontWeight: '500',
    opacity: 0.7,
  },
  statDivider: { 
    width: 1, 
    marginVertical: 4,
  },

  /* Section */
  section: { 
    marginBottom: 28,
  },
  lastSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
    minHeight: 68,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsLeft: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    borderRadius: 12,
    padding: 10,
    marginRight: 16,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  settingsTitle: { 
    fontSize: 16, 
    fontWeight: '600',
    marginBottom: 2,
  },
  settingsSubtitle: { 
    fontSize: 13,
    opacity: 0.7,
  },
  settingsRight: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft: 12,
  },

  /* Logout */
  logoutBtn: { 
    marginTop: 8,
    marginBottom: 24,
    alignSelf: 'stretch',
  },
  logoutInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: { 
    fontWeight: '600', 
    fontSize: 16, 
    marginLeft: 10,
  },

  /* Version */
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '500',
  },
});