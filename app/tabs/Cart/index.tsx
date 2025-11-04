/**
 * CartTab – Fully customized e-commerce cart screen
 * Expo + React-Native + TypeScript + Dark Theme
 * Matches the HomeTab design: Dark slate + purple accents
 */

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ────────────────────── Mock Cart Data ────────────────────── */
// In a real app, use Redux/Context/AsyncStorage for global cart
const initialCart = [
  {
    id: 1,
    name: 'Chronos Elite',
    price: 249,
    quantity: 1,
    image: 'https://placehold.co/400x400/1e293b/ffffff?text=Watch',
  },
  {
    id: 2,
    name: 'Nova Runner',
    price: 189,
    quantity: 2,
    image: 'https://placehold.co/400x400/0f172a/ffffff?text=Shoes',
  },
  {
    id: 3,
    name: 'AirBuds Pro',
    price: 299,
    quantity: 1,
    image: 'https://placehold.co/400x400/1e3a8a/ffffff?text=EarBuds',
  },
];

/* ────────────────────── Reusable Components ────────────────────── */
const CartHeader = ({ itemCount }: { itemCount: number }) => (
  <View style={s.header}>
    <Text style={s.headerTitle}>Your Cart</Text>
    <Text style={s.headerSubtitle}>
      {itemCount} {itemCount === 1 ? 'item' : 'items'}
    </Text>
  </View>
);

const CartItem: React.FC<{
  item: typeof initialCart[number];
  onQuantityChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}> = ({ item, onQuantityChange, onRemove }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onRemove(item.id));
  };

  return (
    <Animated.View style={[s.itemCard, { opacity: fadeAnim }]}>
      <Image source={{ uri: item.image }} style={s.itemImage} />
      <View style={s.itemDetails}>
        <Text style={s.itemName}>{item.name}</Text>
        <Text style={s.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={s.quantityWrapper}>
          <TouchableOpacity
            style={s.quantityBtn}
            onPress={() => onQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <Ionicons name="remove" size={18} color="#9ca3af" />
          </TouchableOpacity>
          <Text style={s.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={s.quantityBtn} onPress={() => onQuantityChange(item.id, 1)}>
            <Ionicons name="add" size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={s.removeBtn} onPress={handleRemove}>
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const PromoCode = () => {
  const [code, setCode] = useState('');

  return (
    <View style={s.promoSection}>
      <Text style={s.promoTitle}>Promo Code</Text>
      <View style={s.promoInputWrapper}>
        <TextInput
          style={s.promoInput}
          placeholder="Enter code"
          placeholderTextColor="#9ca3af"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity style={s.promoApplyBtn}>
          <Text style={s.promoApplyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartSummary = ({
  subtotal,
  discount = 0,
  tax = 0,
  total,
}: {
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
}) => (
  <View style={s.summary}>
    <View style={s.summaryRow}>
      <Text style={s.summaryLabel}>Subtotal</Text>
      <Text style={s.summaryValue}>${subtotal.toFixed(2)}</Text>
    </View>
    {discount > 0 && (
      <View style={s.summaryRow}>
        <Text style={s.summaryLabel}>Discount</Text>
        <Text style={s.summaryValue}>-${discount.toFixed(2)}</Text>
      </View>
    )}
    <View style={s.summaryRow}>
      <Text style={s.summaryLabel}>Tax</Text>
      <Text style={s.summaryValue}>${tax.toFixed(2)}</Text>
    </View>
    <View style={s.summaryDivider} />
    <View style={s.summaryRow}>
      <Text style={s.summaryTotalLabel}>Total</Text>
      <Text style={s.summaryTotalValue}>${total.toFixed(2)}</Text>
    </View>
  </View>
);

const CheckoutButton = () => (
  <TouchableOpacity style={s.checkoutBtn}>
    <LinearGradient colors={['#6366f1', '#4c1d95']} style={s.checkoutGradient}>
      <Text style={s.checkoutText}>Proceed to Checkout</Text>
      <Ionicons name="arrow-forward" size={18} color="#fff" style={s.checkoutIcon} />
    </LinearGradient>
  </TouchableOpacity>
);

const EmptyCart = () => (
  <View style={s.emptyContainer}>
    <Ionicons name="bag-outline" size={80} color="#4b5563" />
    <Text style={s.emptyTitle}>Your Cart is Empty</Text>
    <Text style={s.emptySubtitle}>Add some products to get started!</Text>
    <TouchableOpacity style={s.emptyBtn}>
      <Text style={s.emptyBtnText}>Browse Products</Text>
    </TouchableOpacity>
  </View>
);

/* ────────────────────── Main Screen ────────────────────── */
export default function CartTab() {
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax example
  const total = subtotal + tax;

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <View style={s.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
        )}
        ListHeaderComponent={<CartHeader itemCount={cart.length} />}
        ListFooterComponent={
          <>
            <PromoCode />
            <CartSummary subtotal={subtotal} tax={tax} total={total} />
            <CheckoutButton />
          </>
        }
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
  listContent: { padding: 20, paddingBottom: 40 },

  /* Header */
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#9ca3af', marginTop: 4 },

  /* Item Card */
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImage: { width: 80, height: 80, borderRadius: 12, marginRight: 16 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', color: '#e5e7eb' },
  itemPrice: { fontSize: 18, fontWeight: '700', color: '#a78bfa', marginTop: 4 },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 4,
  },
  quantityBtn: { padding: 8 },
  quantityText: { color: '#fff', fontWeight: '600', marginHorizontal: 12 },
  removeBtn: { padding: 8 },

  /* Promo */
  promoSection: { marginVertical: 24 },
  promoTitle: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: 8 },
  promoInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  promoInput: { flex: 1, padding: 12, color: '#e5e7eb' },
  promoApplyBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  promoApplyText: { color: '#fff', fontWeight: '600' },

  /* Summary */
  summary: { marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: '#9ca3af' },
  summaryValue: { fontSize: 14, color: '#e5e7eb' },
  summaryDivider: { height: 1, backgroundColor: '#374151', marginVertical: 8 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: '#fff' },
  summaryTotalValue: { fontSize: 16, fontWeight: '700', color: '#a78bfa' },

  /* Checkout */
  checkoutBtn: { borderRadius: 16, overflow: 'hidden' },
  checkoutGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  checkoutIcon: { marginLeft: 8 },

  /* Empty State */
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 24 },
  emptySubtitle: { fontSize: 16, color: '#9ca3af', marginTop: 8 },
  emptyBtn: {
    marginTop: 24,
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});