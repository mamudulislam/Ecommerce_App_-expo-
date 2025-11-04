// app/_layout.tsx or TabsLayout.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type AnimatedIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  size?: number;
};

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ name, color, focused, size = 26 }) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.15 : 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0.7,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]); // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <Ionicons name={name as any} color={color} size={size} />
    </Animated.View>
  );
};

const CartBadge = ({ count = 0 }: { count?: number }) => {
  if (count === 0) return null;

  return (
    <View style={s.cartBadge}>
      <Text style={s.cartBadgeText}>{count}</Text>
    </View>
  );
};

const TabsLayout = () => {
  // Demo cart count; in real app, use context or store
  const [cartCount] = React.useState(5);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: s.tabBar,
        tabBarLabelStyle: s.tabLabel,
        tabBarItemStyle: s.tabItem,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon name="home-outline" color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />

      <Tabs.Screen
        name="Chat"
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon name="chatbubble-outline" color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />

      <Tabs.Screen
        name="Cart"
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, focused }) => (
            <View style={s.tabIconWrapper}>
              <AnimatedIcon name="bag-outline" color={color} focused={focused} />
              <CartBadge count={cartCount} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedIcon name="person-outline" color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
    </Tabs>
  );
};

const s = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(17, 24, 39, 0.85)', // Glassy dark
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    paddingBottom: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  tabItem: {
    paddingVertical: 10,
  },
  tabIconWrapper: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -10,
    top: -6,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default TabsLayout;