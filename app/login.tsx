import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

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

const LoginButton: React.FC<{
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
        s.loginButton,
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
          <Text style={s.loginButtonText}>Signing In...</Text>
        </View>
      ) : (
        <Text style={s.loginButtonText}>{title}</Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

/* ────────────────────── Main Login Screen ────────────────────── */
export default function LoginScreen() {
  console.log('useTheme:', useTheme());
  const { colors, isDark } = useTheme();
  const router = useRouter();
  console.log('useAuth:', useAuth());
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      login();
    }, 2000);
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google Login', 'Google authentication would be implemented here');
  };

  const handleAppleLogin = () => {
    Alert.alert('Apple Login', 'Apple authentication would be implemented here');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Facebook Login', 'Facebook authentication would be implemented here');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  const isFormValid = email.length > 0 && password.length >= 6;

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
            <Text style={[s.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[s.subtitle, { color: colors.textSecondary }]}>
              Sign in to continue your shopping journey
            </Text>
          </View>

          {/* Form Section */}
          <View style={s.form}>
            <EmailInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
            />
            
            <PasswordInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
            />

            {/* Remember Me & Forgot Password */}
            <View style={s.formOptions}>
              <TouchableOpacity
                style={s.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[
                  s.checkbox,
                  { 
                    backgroundColor: rememberMe ? colors.primary : 'transparent',
                    borderColor: rememberMe ? colors.primary : colors.border 
                  }
                ]}>
                  {rememberMe && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={[s.rememberMeText, { color: colors.text }]}>
                  Remember me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
                <Text style={[s.forgotPasswordText, { color: colors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <LoginButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              disabled={!isFormValid || loading}
            />

            {/* Divider */}
            <View style={s.dividerContainer}>
              <View style={[s.divider, { backgroundColor: colors.border }]} />
              <Text style={[s.dividerText, { color: colors.textSecondary }]}>or continue with</Text>
              <View style={[s.divider, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Login Buttons */}
            <View style={s.socialButtonsContainer}>
              <SocialButton
                icon="logo-google"
                title="Google"
                onPress={handleGoogleLogin}
                color="#DB4437"
              />
              <SocialButton
                icon="logo-apple"
                title="Apple"
                onPress={handleAppleLogin}
                color="#000000"
              />
              <SocialButton
                icon="logo-facebook"
                title="Facebook"
                onPress={handleFacebookLogin}
                color="#1877F2"
              />
            </View>
          </View>

          {/* Sign Up Section */}
          <View style={s.signUpContainer}>
            <Text style={[s.signUpText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={handleSignUp} activeOpacity={0.7}>
              <Text style={[s.signUpLink, { color: colors.primary }]}>
                Sign Up
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

  /* Form Options */
  formOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },

  /* Login Button */
  loginButton: {
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
  loginButtonText: {
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

  /* Sign Up Section */
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  signUpText: {
    fontSize: 15,
  },
  signUpLink: {
    fontSize: 15,
    fontWeight: '700',
  },
});