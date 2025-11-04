/**
 * WishlistTab – Fully customized e-commerce wishlist screen
 * Expo + React-Native + TypeScript + Dark Theme
 * Matches the HomeTab, CartTab, CategoriesTab design: Dark slate + purple accents
 * Features: Grid layout with glassy cards, move to cart, remove animation, empty state
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_WIDTH - 60) / NUM_COLUMNS;

/* ────────────────────── Mock Wishlist Data ────────────────────── */
// In a real app, sync with user profile or AsyncStorage
const initialWishlist = [
  {
    id: 1,
    name: 'Chronos Elite Watch',
    price: 249,
    image: 'https://placehold.co/400x400/1e293b/ffffff?text=Watch',
    inStock: true,
  },
  {
    id: 2,
    name: 'Nova Runner Shoes',
    price: 189,
    image: 'https://placehold.co/400x400/0f172a/ffffff?text=Shoes',
    inStock: true,
  },
  {
    id: 3,
    name: 'Studio Beats Pro',
    price: 299,
    image: 'https://placehold.co/400x400/111827/ffffff?text=Headphones',
    inStock: false,
  },
  {
    id: 4,
    name: 'Leather Vault Wallet',
    price: 79,
    image: 'https://placehold.co/400x400/7c2d12/ffffff?text=Wallet',
    inStock: true,
  },
  {
    id: 5,
    name: 'Eco Yoga Mat',
    price: 39,
    image: 'https://placehold.co/400x400/6b21a8/ffffff?text=Yoga',
    inStock: true,
  },
  {
    id: 6,
    name: 'DSLR Pro Camera',
    price: 1199,
    image: 'https://placehold.co/400x400/1f2937/ffffff?text=Camera',
    inStock: false,
  },
];

/* ────────────────────── Reusable Components ────────────────────── */
const WishlistHeader = ({ itemCount }: { itemCount: number }) => (
  <View style={s.header}>
    <Text style={s.headerTitle}>My Wishlist</Text>
    <Text style={s.headerSubtitle}>
      {itemCount} {itemCount === 1 ? 'item' : 'items'} saved
    </Text>
  </View>
);

const WishlistCard: React.FC<{
  item: typeof initialWishlist[number];
  onRemove: (id: number) => void;
  onMoveToCart: (id: number) => void;
}> = ({ item, onRemove, onMoveToCart }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => onRemove(item.id));
  };

  const handleMoveToCart = () => {
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
    ]).start(() => onMoveToCart(item.id));
  };

  return (
    <Animated.View
      style={[
        s.card,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} style={s.cardInner}>
        <View style={s.imageWrapper}>
          <Image source={{ uri: item.image }} style={s.cardImage} />
          {!item.inStock && (
            <View style={s.outOfStock}>
              <Text style={s.outOfStockText}>Out of Stock</Text>
            </View>
          )}
          <TouchableOpacity style={s.heartBtn} onPress={handleRemove}>
            <Ionicons name="heart" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={s.cardBody}>
          <Text style={s.cardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={s.cardPrice}>${item.price.toFixed(2)}</Text>

          <View style={s.actionRow}>
            <TouchableOpacity
              style={[s.actionBtn, s.moveBtn, !item.inStock && s.disabledBtn]}
              onPress={handleMoveToCart}
              disabled={!item.inStock}
            >
              <Ionicons name="cart-outline" size={16} color="#fff" />
              <Text style={s.actionBtnText}>Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[s.actionBtn, s.removeBtn]} onPress={handleRemove}>
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const EmptyWishlist = () => (
  <View style={s.emptyContainer}>
    <Ionicons name="heart-outline" size={80} color="#4b5563" />
    <Text style={s.emptyTitle}>Your Wishlist is Empty</Text>
    <Text style={s.emptySubtitle}>Save items you love for later!</Text>
    <TouchableOpacity style={s.emptyBtn}>
      <Text style={s.emptyBtnText}>Start Browsing</Text>
    </TouchableOpacity>
  </View>
);

/* ────────────────────── Main Screen ────────────────────── */
export default function WishlistTab() {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const removeItem = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const moveToCart = (id: number) => {
    const item = wishlist.find((i) => i.id === id);
    if (item && item.inStock) {
      // In real app: dispatch to cart context
      console.log('Moved to cart:', item.name);
      removeItem(id); // Remove from wishlist after moving
    }
  };

  if (wishlist.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <View style={s.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <WishlistCard
            item={item}
            onRemove={removeItem}
            onMoveToCart={moveToCart}
          />
        )}
        numColumns={NUM_COLUMNS}
        ListHeaderComponent={<WishlistHeader itemCount={wishlist.length} />}
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

  /* Card */
  card: {
    width: CARD_WIDTH,
    margin: 8,
  },
  cardInner: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrapper: { position: 'relative' },
  cardImage: { width: '100%', height: 140, borderRadius: 16 },
  outOfStock: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  outOfStockText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 6,
    borderRadius: 20,
  },
  cardBody: { padding: 12 },
  cardName: { fontSize: 14, fontWeight: '600', color: '#e5e7eb', marginBottom: 4 },
  cardPrice: { fontSize: 18, fontWeight: '700', color: '#a78bfa', marginBottom: 8 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  moveBtn: {
    backgroundColor: '#6366f1',
  },
  removeBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  disabledBtn: {
    backgroundColor: '#4b5563',
    opacity: 0.6,
  },
  actionBtnText: { color: '#fff', fontWeight: '600', fontSize: 12, marginLeft: 4 },

  /* Empty State */
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#fff', marginTop: 24, textAlign: 'center' },
  emptySubtitle: { fontSize: 16, color: '#9ca3af', marginTop: 8, textAlign: 'center' },
  emptyBtn: {
    marginTop: 24,
    backgroundColor: '#6366f1',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});