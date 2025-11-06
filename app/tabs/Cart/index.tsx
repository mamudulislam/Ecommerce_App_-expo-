import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../../../contexts/AppContext';
import { useTheme } from '../../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ────────────────────── Reusable Components ────────────────────── */
const CartHeader = ({ itemCount }: { itemCount: number }) => {
  const { colors } = useTheme();
  return (
    <View style={s.header}>
      <Text style={[s.headerTitle, { color: colors.text }]}>Your Cart</Text>
      <Text style={[s.headerSubtitle, { color: colors.textSecondary }]}>
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </Text>
    </View>
  );
};

const CartItem: React.FC<{
  item: any;
  onQuantityChange: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}> = ({ item, onQuantityChange, onRemove }) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onRemove(item.id));
  };

  return (
    <Animated.View style={[s.itemCard, { 
      backgroundColor: colors.card,
      borderColor: colors.borderLight,
      opacity: fadeAnim 
    }]}>
      <Image source={{ uri: item.image }} style={s.itemImage} />
      <View style={s.itemDetails}>
        <Text style={[s.itemName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[s.itemPrice, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>
        <View style={[s.quantityWrapper, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={s.quantityBtn}
            onPress={() => onQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <Ionicons name="remove" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[s.quantityText, { color: colors.text }]}>{item.quantity}</Text>
          <TouchableOpacity style={s.quantityBtn} onPress={() => onQuantityChange(item.id, 1)}>
            <Ionicons name="add" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={s.removeBtn} onPress={handleRemove}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const PromoCode = () => {
  const { colors } = useTheme();
  const [code, setCode] = React.useState('');

  return (
    <View style={s.promoSection}>
      <Text style={[s.promoTitle, { color: colors.text }]}>Promo Code</Text>
      <View style={[s.promoInputWrapper, { 
        backgroundColor: colors.surface,
        borderColor: colors.border 
      }]}>
        <TextInput
          style={[s.promoInput, { color: colors.text }]}
          placeholder="Enter code"
          placeholderTextColor={colors.textSecondary}
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity style={[s.promoApplyBtn, { backgroundColor: colors.primary }]}>
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
}) => {
  const { colors } = useTheme();
  return (
    <View style={s.summary}>
      <View style={s.summaryRow}>
        <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
        <Text style={[s.summaryValue, { color: colors.text }]}>${subtotal.toFixed(2)}</Text>
      </View>
      {discount > 0 && (
        <View style={s.summaryRow}>
          <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>Discount</Text>
          <Text style={[s.summaryValue, { color: colors.success }]}>-${discount.toFixed(2)}</Text>
        </View>
      )}
      <View style={s.summaryRow}>
        <Text style={[s.summaryLabel, { color: colors.textSecondary }]}>Tax</Text>
        <Text style={[s.summaryValue, { color: colors.text }]}>${tax.toFixed(2)}</Text>
      </View>
      <View style={[s.summaryDivider, { backgroundColor: colors.border }]} />
      <View style={s.summaryRow}>
        <Text style={[s.summaryTotalLabel, { color: colors.text }]}>Total</Text>
        <Text style={[s.summaryTotalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const CheckoutButton = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const { cart } = useApp();

  const handleCheckout = () => {
    if (cart.length > 0) {
      router.push('/checkout');
    }
  };

  return (
    <TouchableOpacity 
      style={s.checkoutBtn} 
      onPress={handleCheckout}
      disabled={cart.length === 0}
    >
      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={s.checkoutGradient}>
        <Text style={s.checkoutText}>Proceed to Checkout</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" style={s.checkoutIcon} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const EmptyCart = () => {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View style={[s.emptyContainer, { backgroundColor: colors.background }]}>
      <Ionicons name="bag-outline" size={80} color={colors.textTertiary} />
      <Text style={[s.emptyTitle, { color: colors.text }]}>Your Cart is Empty</Text>
      <Text style={[s.emptySubtitle, { color: colors.textSecondary }]}>Add some products to get started!</Text>
      <TouchableOpacity 
        style={[s.emptyBtn, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/tabs/Home')}
      >
        <Text style={s.emptyBtnText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function CartTab() {
  const { colors } = useTheme();
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useApp();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax example
  const total = subtotal + tax;

  if (cart.length === 0) {
    return <EmptyCart />;
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem item={item} onQuantityChange={updateCartQuantity} onRemove={removeFromCart} />
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
    </SafeAreaView>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 40 },

  /* Header */
  header: { marginBottom: 24 },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  headerSubtitle: { fontSize: 14, marginTop: 4 },

  /* Item Card */
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImage: { width: 80, height: 80, borderRadius: 12, marginRight: 16 },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemPrice: { fontSize: 18, fontWeight: '700', marginTop: 4 },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 20,
    padding: 4,
  },
  quantityBtn: { padding: 8 },
  quantityText: { fontWeight: '600', marginHorizontal: 12 },
  removeBtn: { padding: 8 },

  /* Promo */
  promoSection: { marginVertical: 24 },
  promoTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  promoInputWrapper: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
  },
  promoInput: { flex: 1, padding: 12 },
  promoApplyBtn: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  promoApplyText: { color: '#fff', fontWeight: '600' },

  /* Summary */
  summary: { marginBottom: 24 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14 },
  summaryDivider: { height: 1, marginVertical: 8 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700' },
  summaryTotalValue: { fontSize: 16, fontWeight: '700' },

  /* Checkout */
  checkoutBtn: { borderRadius: 16, overflow: 'hidden' },
  checkoutGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16 },
  checkoutText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  checkoutIcon: { marginLeft: 8 },

  /* Empty State */
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 24, fontWeight: '700', marginTop: 24 },
  emptySubtitle: { fontSize: 16, marginTop: 8 },
  emptyBtn: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});