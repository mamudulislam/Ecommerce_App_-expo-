import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const OTP_LENGTH = 6;

const OTPInput: React.FC<{
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ otp, setOtp }) => {
  const { colors } = useTheme();
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleInputChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length === 1 && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={s.otpContainer}>
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => (inputsRef.current[index] = ref)}
          style={[
            s.otpInput,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: otp[index] ? colors.primary : colors.border,
            },
          ]}
          value={otp[index]}
          onChangeText={text => handleInputChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectionColor={colors.primary}
        />
      ))}
    </View>
  );
};

const SubmitButton: React.FC<{
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
        s.submitButton,
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
          <Text style={s.submitButtonText}>Verifying...</Text>
        </View>
      ) : (
        <Text style={s.submitButtonText}>{title}</Text>
      )}
    </AnimatedTouchableOpacity>
  );
};

export default function ForgotPasswordOTPScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== OTP_LENGTH) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (otpCode === '123456') { // Demo: correct OTP
        Alert.alert('Success', 'Your password has been reset.', [
          { text: 'OK', onPress: () => router.replace('/login') },
        ]);
      } else {
        Alert.alert('Error', 'The OTP is incorrect. Please try again.');
        setOtp(Array(OTP_LENGTH).fill(''));
      }
    }, 2000);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;

    Alert.alert('Code Sent', `A new code has been sent to ${email}`);
    setResendTimer(60);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const isFormValid = otp.join('').length === OTP_LENGTH;

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
          {/* Back Button */}
          <TouchableOpacity
            style={s.backButton}
            onPress={handleBackToLogin}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Header Section */}
          <View style={s.header}>
            <View style={[s.iconContainer, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="shield-checkmark-outline" size={32} color={colors.primary} />
            </View>
            <Text style={[s.title, { color: colors.text }]}>Enter OTP</Text>
            <Text style={[s.subtitle, { color: colors.textSecondary }]}>
              A 6-digit code has been sent to{' '}
              <Text style={{ fontWeight: 'bold', color: colors.text }}>{email}</Text>
            </Text>
          </View>

          {/* Form Section */}
          <View style={s.form}>
            <OTPInput otp={otp} setOtp={setOtp} />

            <SubmitButton
              title="Verify Code"
              onPress={handleSubmit}
              loading={loading}
              disabled={!isFormValid || loading}
            />

            {/* Resend Code */}
            <View style={s.helpContainer}>
              <Text style={[s.helpText, { color: colors.textSecondary }]}>
                Didn't receive the code?{' '}
                <Text
                  style={[
                    s.helpLink,
                    { color: resendTimer > 0 ? colors.textTertiary : colors.primary },
                  ]}
                  onPress={handleResendCode}
                  disabled={resendTimer > 0}
                >
                  Resend {resendTimer > 0 ? `(${resendTimer}s)` : ''}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    borderWidth: 2,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 15,
    textAlign: 'center',
  },
  helpLink: {
    fontWeight: '600',
  },
});