import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/* ────────────────────── Reusable Components ────────────────────── */
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SocialButton: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  color: string;
}> = ({ icon, title, onPress, color }) => {
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        s.socialButton,
        { backgroundColor: color, transform: [{ scale: scaleAnim }] },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Ionicons name={icon} size={20} color="#fff" />
      <Text style={s.socialButtonText}>{title}</Text>
    </AnimatedTouchableOpacity>
  );
};

const PasswordInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}> = ({ value, onChangeText, placeholder }) => {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = useState(true);

  return (
    <View style={[s.inputContainer, { backgroundColor: colors.surface }]}>
      <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={s.inputIcon} />
      <TextInput
        style={[s.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isSecure}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={s.eyeButton}
        onPress={() => setIsSecure(!isSecure)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isSecure ? 'eye-outline' : 'eye-off-outline'}
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const EmailInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}> = ({ value, onChangeText, placeholder }) => {
  const { colors } = useTheme();

  return (
    <View style={[s.inputContainer, { backgroundColor: colors.surface }]}>
      <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={s.inputIcon} />
      <TextInput
        style={[s.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
      />
    </View>
  );
};

const NameInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}> = ({ value, onChangeText, placeholder }) => {
  const { colors } = useTheme();

  return (
    <View style={[s.inputContainer, { backgroundColor: colors.surface }]}>
      <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={s.inputIcon} />
      <TextInput
        style={[s.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="words"
        autoCorrect={false}
        autoComplete="name"
      />
    </View>
  );
};

const RegisterButton: React.FC<{
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}> = ({ title, onPress, loading = false, disabled = false }) => {
  const { colors } = useTheme();
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handlePress = () => {
    if (disabled || loading) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onPress());
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        s.registerButton,
        {
          backgroundColor: disabled ? colors.textTertiary : colors.primary,
          transform: [{ scale: scaleAnim }],
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.9}
    >
      {loading ? (
        <View style={s.loadingContainer}>
          <Ionicons name="reload" size={20} color="#fff" style={s.loadingIcon} />
          <Text style={s.registerButtonText}>Creating Account...</Text>
        </View>
      ) : (
        <Text style={s.registerButtonText}>{title}</Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

/* ────────────────────── Main Register Screen ────────────────────── */
export default function RegisterScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (!acceptTerms) {
      Alert.alert('Error', 'Please accept the Terms & Conditions');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success!',
        'Your account has been created successfully',
        [
          {
            text: 'Continue',
            onPress: () => login()
          }
        ]
      );
    }, 2000);
  };

  const handleGoogleRegister = () => {
    Alert.alert('Google Sign Up', 'Google authentication would be implemented here');
  };

  const handleAppleRegister = () => {
    Alert.alert('Apple Sign Up', 'Apple authentication would be implemented here');
  };

  const handleFacebookRegister = () => {
    Alert.alert('Facebook Sign Up', 'Facebook authentication would be implemented here');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleTermsPress = () => {
    Alert.alert('Terms & Conditions', 'Terms and conditions would be displayed here');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy Policy', 'Privacy policy would be displayed here');
  };

  const isFormValid = formData.firstName.length > 0 &&
    formData.lastName.length > 0 &&
    formData.email.length > 0 &&
    formData.password.length >= 6 &&
    formData.confirmPassword.length >= 6 &&
    acceptTerms;

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <KeyboardAvoidingView
        style={s.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={s.header}>
            <View style={[s.logoContainer, { backgroundColor: colors.primary }]}>
              <Ionicons name="cart" size={32} color="#fff" />
            </View>
            <Text style={[s.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[s.subtitle, { color: colors.textSecondary }]}>
              Join us and start your shopping journey
            </Text>
          </View>

          {/* Form Section */}
          <View style={s.form}>
            {/* Name Fields */}
            <View style={s.nameContainer}>
              <View style={[s.nameInputContainer, { marginRight: 8 }]}>
                <NameInput
                  value={formData.firstName}
                  onChangeText={(text) => updateFormData('firstName', text)}
                  placeholder="First name"
                />
              </View>
              <View style={[s.nameInputContainer, { marginLeft: 8 }]}>
                <NameInput
                  value={formData.lastName}
                  onChangeText={(text) => updateFormData('lastName', text)}
                  placeholder="Last name"
                />
              </View>
            </View>

            <EmailInput
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="Enter your email"
            />

            <PasswordInput
              value={formData.password}
              onChangeText={(text) => updateFormData('password', text)}
              placeholder="Create password"
            />

            <PasswordInput
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData('confirmPassword', text)}
              placeholder="Confirm password"
            />

            {/* Terms & Conditions */}
            <View style={s.termsContainer}>
              <TouchableOpacity
                style={s.termsCheckContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
                activeOpacity={0.7}
              >
                <View style={[
                  s.checkbox,
                  {
                    backgroundColor: acceptTerms ? colors.primary : 'transparent',
                    borderColor: acceptTerms ? colors.primary : colors.border
                  }
                ]}>
                  {acceptTerms && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={[s.termsText, { color: colors.text }]}>
                  I agree to the{' '}
                  <Text style={[s.termsLink, { color: colors.primary }]} onPress={handleTermsPress}>
                    Terms & Conditions
                  </Text>{' '}
                  and{' '}
                  <Text style={[s.termsLink, { color: colors.primary }]} onPress={handlePrivacyPress}>
                    Privacy Policy
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <RegisterButton
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              disabled={!isFormValid || loading}
            />

            {/* Divider */}
            <View style={s.dividerContainer}>
              <View style={[s.divider, { backgroundColor: colors.border }]} />
              <Text style={[s.dividerText, { color: colors.textSecondary }]}>or sign up with</Text>
              <View style={[s.divider, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Register Buttons */}
            <View style={s.socialButtonsContainer}>
              <SocialButton
                icon="logo-google"
                title="Google"
                onPress={handleGoogleRegister}
                color="#DB4437"
              />
              <SocialButton
                icon="logo-apple"
                title="Apple"
                onPress={handleAppleRegister}
                color="#000000"
              />
              <SocialButton
                icon="logo-facebook"
                title="Facebook"
                onPress={handleFacebookRegister}
                color="#1877F2"
              />
            </View>
          </View>

          {/* Login Section */}
          <View style={s.loginContainer}>
            <Text style={[s.loginText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
              <Text style={[s.loginLink, { color: colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* Header */
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  /* Form */
  form: {
    marginBottom: 30,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  nameInputContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  eyeButton: {
    padding: 4,
  },

  /* Terms & Conditions */
  termsContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  termsCheckContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  termsText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
  },

  /* Register Button */
  registerButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* Divider */
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 16,
  },

  /* Social Buttons */
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  /* Login Section */
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loginText: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '700',
  },
});