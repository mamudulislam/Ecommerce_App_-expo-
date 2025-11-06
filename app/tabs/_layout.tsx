import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View, StyleSheet, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}

const TabIcon = ({ name, focused }: TabIconProps) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1);
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.tabIconContainer}>
      <Animated.View style={animatedStyle}>
        <Ionicons 
          name={name} 
          color={focused ? colors.primary : colors.textSecondary} 
          size={24} 
        />
      </Animated.View>
    </View>
  );
};

const TabsLayout = () => {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: colors.tabBar,
          borderRadius: 32,
          height: 60,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.3 : 0.15,
          shadowRadius: 3.84,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: colors.border,
          ...Platform.select({
            android: {
              borderTopWidth: 0,
            },
          })
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Categories"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'list' : 'list-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'cart' : 'cart-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Wishlist"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'heart' : 'heart-outline'} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabsLayout;



