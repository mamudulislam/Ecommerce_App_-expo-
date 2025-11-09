import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../../contexts/AppContext';
import { useTheme } from '../../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_WIDTH - 60) / NUM_COLUMNS;

/* ────────────────────── Reusable Components ────────────────────── */
const WishlistHeader = ({ itemCount }: { itemCount: number }) => {
  const { colors } = useTheme();
  return (
    <View style={s.header}>
      <Text style={[s.headerTitle, { color: colors.text }]}>My Wishlist</Text>
      <Text style={[s.headerSubtitle, { color: colors.textSecondary }]}>
        {itemCount} {itemCount === 1 ? 'item' : 'items'} saved
      </Text>
    </View>
  );
};

const WishlistCard: React.FC<{
  item: any;
  onRemove: (id: number) => void;
  onMoveToCart: (id: number) => void;
}> = ({ item, onRemove, onMoveToCart }) => {
  const { colors } = useTheme();
  const router = useRouter();
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
      <TouchableOpacity
        activeOpacity={0.9}
        style={[s.cardInner, {
          backgroundColor: colors.card,
          borderColor: colors.borderLight
        }]}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={s.imageWrapper}>
          <Image source={{ uri: item.image }} style={s.cardImage} />
          {!item.inStock && (
            <View style={[s.outOfStock, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
              <Text style={s.outOfStockText}>Out of Stock</Text>
            </View>
          )}
          <TouchableOpacity
            style={[s.heartBtn, { backgroundColor: colors.surface }]}
            onPress={handleRemove}
          >
            <Ionicons name="heart" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>

        <View style={s.cardBody}>
          <Text style={[s.cardName, { color: colors.text }]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[s.cardPrice, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>

          <View style={s.actionRow}>
            <TouchableOpacity
              style={[
                s.actionBtn,
                s.moveBtn,
                { backgroundColor: item.inStock ? colors.primary : colors.textTertiary },
                !item.inStock && s.disabledBtn
              ]}
              onPress={handleMoveToCart}
              disabled={!item.inStock}
            >
              <Ionicons name="cart-outline" size={16} color="#fff" />
              <Text style={s.actionBtnText}>Add to Cart</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.actionBtn, s.removeBtn, {
                backgroundColor: colors.surface,
                borderColor: colors.error
              }]}
              onPress={handleRemove}
            >
              <Ionicons name="trash-outline" size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const EmptyWishlist = () => {
  const { colors } = useTheme();
  const router = useRouter();
  return (
    <View style={[s.emptyContainer, { backgroundColor: colors.background }]}>
      <Ionicons name="heart-outline" size={80} color={colors.textTertiary} />
      <Text style={[s.emptyTitle, { color: colors.text }]}>Your Wishlist is Empty</Text>
      <Text style={[s.emptySubtitle, { color: colors.textSecondary }]}>Save items you love for later!</Text>
      <TouchableOpacity
        style={[s.emptyBtn, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/tabs/Home')}
      >
        <Text style={s.emptyBtnText}>Select your product</Text>
      </TouchableOpacity>
    </View>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function WishlistTab() {
  const { colors } = useTheme();
  const { wishlist, removeFromWishlist, addToCart } = useApp();

  const moveToCart = (id: number) => {
    const item = wishlist.find((i) => i.id === id);
    if (item && item.inStock) {
      addToCart(item);
      removeFromWishlist(id);
    }
  };

  if (wishlist.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <WishlistCard
            item={item}
            onRemove={removeFromWishlist}
            onMoveToCart={moveToCart}
          />
        )}
        numColumns={NUM_COLUMNS}
        ListHeaderComponent={<WishlistHeader itemCount={wishlist.length} />}
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

  /* Card */
  card: {
    width: CARD_WIDTH,
    margin: 8,
  },
  cardInner: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageWrapper: { position: 'relative' },
  cardImage: { width: '100%', height: 140, borderRadius: 16 },
  outOfStock: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  outOfStockText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    borderRadius: 20,
  },
  cardBody: { padding: 12 },
  cardName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  cardPrice: { fontSize: 18, fontWeight: '700', marginBottom: 8 },

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
  moveBtn: {},
  removeBtn: {
    borderWidth: 1,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  actionBtnText: { color: '#fff', fontWeight: '600', fontSize: 12, marginLeft: 4 },

  /* Empty State */
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyTitle: { fontSize: 24, fontWeight: '700', marginTop: 24, textAlign: 'center' },
  emptySubtitle: { fontSize: 16, marginTop: 8, textAlign: 'center' },
  emptyBtn: {
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});