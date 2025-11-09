import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'order_shipped',
    title: 'Your order has been shipped!',
    message: 'Order #123456 is on its way. Track your package now.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'new_promo',
    title: 'Flash Sale: 50% Off!',
    message: 'Don\'t miss out on our limited-time offer on electronics.',
    timestamp: '1 day ago',
    read: false,
  },
  {
    id: '3',
    type: 'review_request',
    title: 'How was your recent purchase?',
    message: 'We\'d love to hear your feedback on the "Smart Home Hub".',
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: '4',
    type: 'order_delivered',
    title: 'Your order has been delivered',
    message: 'Order #123455 has arrived. Enjoy your new items!',
    timestamp: '5 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'new_collection',
    title: 'New Arrivals: Summer Collection',
    message: 'Check out the latest trends for the summer season.',
    timestamp: '1 week ago',
    read: true,
  },
];

const NotificationIcon = ({ type }: { type: string }) => {
  const { colors } = useTheme();
  const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
    order_shipped: 'rocket-outline',
    new_promo: 'megaphone-outline',
    review_request: 'star-outline',
    order_delivered: 'checkmark-circle-outline',
    new_collection: 'shirt-outline',
  };
  const iconName = iconMap[type] || 'notifications-outline';

  return (
    <View style={[s.iconContainer, { backgroundColor: colors.primary + '20' }]}>
      <Ionicons name={iconName} size={24} color={colors.primary} />
    </View>
  );
};

const NotificationItem = ({ item }: { item: (typeof NOTIFICATIONS)[0] }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        s.itemContainer,
        {
          backgroundColor: item.read ? colors.background : colors.surface,
          borderColor: colors.border,
        },
      ]}
      activeOpacity={0.7}
    >
      <NotificationIcon type={item.type} />
      <View style={s.textContainer}>
        <Text style={[s.itemTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[s.itemMessage, { color: colors.textSecondary }]}>{item.message}</Text>
        <Text style={[s.itemTimestamp, { color: colors.textTertiary }]}>{item.timestamp}</Text>
      </View>
      {!item.read && <View style={[s.unreadDot, { backgroundColor: colors.primary }]} />}
    </TouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={s.header}>
        <Text style={[s.headerTitle, { color: colors.text }]}>Notifications</Text>
      </View>
      <FlatList
        data={NOTIFICATIONS}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={s.listContainer}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 45,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  itemTimestamp: {
    fontSize: 12,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 16,
  },
});
