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
      opacity: fadeAnim,
      shadowColor: colors.shadow || '#000',
    }]}>
      <Image source={{ uri: item.image }} style={s.itemImage} />
      <View style={s.itemDetails}>
        <Text style={[s.itemName, { color: colors.text }]} numberOfLines={2}>{item.name}</Text>
        <Text style={[s.itemPrice, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>
        <View style={[s.quantityWrapper, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[s.quantityBtn, item.quantity <= 1 && s.quantityBtnDisabled]}
            onPress={() => onQuantityChange(item.id, -1)}
            disabled={item.quantity <= 1}
          >
            <Ionicons 
              name="remove" 
              size={18} 
              color={item.quantity <= 1 ? colors.textTertiary : colors.textSecondary} 
            />
          </TouchableOpacity>
          <Text style={[s.quantityText, { color: colors.text }]}>{item.quantity}</Text>
          <TouchableOpacity style={s.quantityBtn} onPress={() => onQuantityChange(item.id, 1)}>
            <Ionicons name="add" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        style={[s.removeBtn, { backgroundColor: colors.surface }]} 
        onPress={handleRemove}
      >
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const PromoCode = () => {
  const { colors } = useTheme();
  const [code, setCode] = React.useState('');
  const [isApplied, setIsApplied] = React.useState(false);

  const handleApply = () => {
    if (code.trim() && !isApplied) {
      setIsApplied(true);
      // Add your promo code validation logic here
    }
  };

  return (
    <View style={s.promoSection}>
      <Text style={[s.promoTitle, { color: colors.text }]}>Promo Code</Text>
      <View style={[s.promoInputWrapper, { 
        backgroundColor: colors.surface,
        borderColor: isApplied ? colors.success : colors.border,
      }]}>
        <TextInput
          style={[s.promoInput, { color: colors.text }]}
          placeholder="Enter code"
          placeholderTextColor={colors.textSecondary}
          value={code}
          onChangeText={setCode}
          editable={!isApplied}
        />
        <TouchableOpacity 
          style={[
            s.promoApplyBtn, 
            { 
              backgroundColor: isApplied ? colors.success : colors.primary,
              opacity: (!code.trim() || isApplied) ? 0.6 : 1
            }
          ]}
          onPress={handleApply}
          disabled={!code.trim() || isApplied}
        >
          <Text style={s.promoApplyText}>
            {isApplied ? 'Applied' : 'Apply'}
          </Text>
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
    <View style={[s.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
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

const CheckoutButton = ({ disabled }: { disabled: boolean }) => {
  const { colors } = useTheme();
  const router = useRouter();

  const handleCheckout = () => {
    if (!disabled) {
      router.push('/checkout');
    }
  };

  return (
    <TouchableOpacity 
      style={[s.checkoutBtn, disabled && s.checkoutBtnDisabled]} 
      onPress={handleCheckout}
      disabled={disabled}
    >
      <LinearGradient 
        colors={disabled ? [colors.textTertiary, colors.textTertiary] : [colors.primary, colors.primaryDark]} 
        style={s.checkoutGradient}
      >
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
    <SafeAreaView style={[s.emptyContainer, { backgroundColor: colors.background }]}>
      <View style={s.emptyContent}>
        <Ionicons name="bag-outline" size={80} color={colors.textTertiary} />
        <Text style={[s.emptyTitle, { color: colors.text }]}>Your Cart is Empty</Text>
        <Text style={[s.emptySubtitle, { color: colors.textSecondary }]}>
          Add some products to get started!
        </Text>
        <TouchableOpacity 
          style={[s.emptyBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/tabs/Home')}
        >
          <Text style={s.emptyBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
          <CartItem 
            item={item} 
            onQuantityChange={updateCartQuantity} 
            onRemove={removeFromCart} 
          />
        )}
        ListHeaderComponent={<CartHeader itemCount={cart.length} />}
        ListFooterComponent={
          <>
            <PromoCode />
            <CartSummary subtotal={subtotal} tax={tax} total={total} />
            <CheckoutButton disabled={cart.length === 0} />
          </>
        }
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        style={s.list}
      />
    </SafeAreaView>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  container: { 
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: { 
    padding: 20, 
    paddingBottom: 40,
  },

  /* Header */
  header: { 
    marginBottom: 24,
    paddingTop: 10,
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSubtitle: { 
    fontSize: 16, 
    marginTop: 4,
    opacity: 0.7,
  },

  /* Item Card */
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemImage: { 
    width: 80, 
    height: 80, 
    borderRadius: 12, 
    marginRight: 16,
  },
  itemDetails: { 
    flex: 1,
    marginRight: 12,
  },
  itemName: { 
    fontSize: 16, 
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  itemPrice: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 8,
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 4,
    alignSelf: 'flex-start',
  },
  quantityBtn: { 
    padding: 6,
    borderRadius: 12,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBtnDisabled: {
    opacity: 0.4,
  },
  quantityText: { 
    fontWeight: '600', 
    marginHorizontal: 12,
    fontSize: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: { 
    padding: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  /* Promo */
  promoSection: { 
    marginVertical: 24,
  },
  promoTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12,
  },
  promoInputWrapper: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  promoInput: { 
    flex: 1, 
    padding: 16,
    fontSize: 16,
  },
  promoApplyBtn: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoApplyText: { 
    color: '#fff', 
    fontWeight: '600',
    fontSize: 14,
  },

  /* Summary */
  summary: { 
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12,
  },
  summaryLabel: { 
    fontSize: 15,
  },
  summaryValue: { 
    fontSize: 15,
    fontWeight: '500',
  },
  summaryDivider: { 
    height: 1, 
    marginVertical: 12,
  },
  summaryTotalLabel: { 
    fontSize: 18, 
    fontWeight: '700',
  },
  summaryTotalValue: { 
    fontSize: 18, 
    fontWeight: '700',
  },

  /* Checkout */
  checkoutBtn: { 
    borderRadius: 16, 
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutBtnDisabled: {
    opacity: 0.6,
  },
  checkoutGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 18,
  },
  checkoutText: { 
    color: '#fff', 
    fontWeight: '700', 
    fontSize: 17,
    letterSpacing: 0.5,
  },
  checkoutIcon: { 
    marginLeft: 8,
  },

  /* Empty State */
  emptyContainer: { 
    flex: 1,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginTop: 24,
    textAlign: 'center',
  },
  emptySubtitle: { 
    fontSize: 16, 
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.7,
  },
  emptyBtn: {
    marginTop: 32,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyBtnText: { 
    color: '#fff', 
    fontWeight: '600', 
    fontSize: 16,
    letterSpacing: 0.5,
  },
});