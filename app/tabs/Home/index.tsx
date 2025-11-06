import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
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
const Header = () => {
  const { getCartCount } = useApp();
  const { colors } = useTheme();
  const router = useRouter();
  const cartCount = getCartCount();

  return (
    <View style={[s.header, { backgroundColor: colors.background }]}>
      <View style={s.headerLeft}>
        <Image source={{ uri: 'https://placehold.co/56x56/6366f1/fff?text=JW' }} style={[s.avatar, { borderColor: colors.primary }]} />
        <View>
          <Text style={[s.welcome, { color: colors.textSecondary }]}>Welcome back,</Text>
          <Text style={[s.user, { color: colors.text }]}>John William</Text>
        </View>
      </View>

      <View style={s.headerRight}>
        <TouchableOpacity style={[s.iconBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          <View style={[s.badge, { backgroundColor: colors.error }]} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[s.cartBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/tabs/Cart')}
        >
          <Ionicons name="cart-outline" size={26} color="#fff" />
          {cartCount > 0 && (
            <View style={s.cartBadge}>
              <Text style={s.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const { colors } = useTheme();
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <View style={[s.searchContainer, { 
      backgroundColor: colors.surface,
      borderColor: focused ? colors.primary : colors.border 
    }]}>
      <Ionicons name="search" size={20} color={focused ? colors.primary : colors.textSecondary} />
      <TextInput
        placeholder="Search products, brands…"
        placeholderTextColor={colors.textSecondary}
        style={[s.searchInput, { color: colors.text }]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && searchQuery && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <Ionicons name="close" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

/* Hero Banner Carousel */
const Banner = () => {
  const { colors } = useTheme();
  const scrollX = useRef(new Animated.Value(0)).current;
  const banners: Array<{ title: string; discount: string; collection: string; color: [string, string] }> = [
    { title: 'Winter Sale', discount: '30% OFF', collection: 'Cozy Essentials', color: ['#4c1d95', '#7c3aed'] },
    { title: 'Tech Fest', discount: 'UP TO 50%', collection: 'Gadgets & Gear', color: ['#1e293b', '#475569'] },
    { title: 'Style Drop', discount: '25% OFF', collection: 'Streetwear', color: ['#0f172a', '#1e293b'] },
  ];

  return (
    <View style={s.bannerWrapper}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {banners.map((b, i) => (
          <LinearGradient key={i} colors={b.color} style={s.bannerCard}>
            <View style={s.bannerText}>
              <Text style={s.bannerTag}>{b.title}</Text>
              <Text style={s.bannerDiscount}>{b.discount}</Text>
              <Text style={s.bannerSubtitle}>{b.collection}</Text>
              <TouchableOpacity style={s.bannerCta}>
                <Text style={s.bannerCtaText}>Shop Now</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: 'https://placehold.co/180x180/fff/000?text=Img' }}
              style={s.bannerImg}
            />
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={s.dots}>
        {banners.map((_, i) => {
          const inputRange = [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH];
          const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 20, 8], extrapolate: 'clamp' });
          const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
          return (
            <Animated.View key={i} style={[s.dot, { width: dotWidth, opacity, backgroundColor: colors.primary }]} />
          );
        })}
      </View>
    </View>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => {
  const { colors } = useTheme();
  return (
    <View style={s.sectionHeader}>
      <Text style={[s.sectionTitle, { color: colors.text }]}>{title}</Text>
      <TouchableOpacity style={s.seeAll}>
        <Text style={[s.seeAllText, { color: colors.primary }]}>See All</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const ProductCard: React.FC<{ product: any; onPress: () => void }> = ({ product, onPress }) => {
  const { colors } = useTheme();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const scale = useRef(new Animated.Value(1)).current;
  const inWishlist = isInWishlist(product.id);

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const handleWishlist = (e: any) => {
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    animatePress();
    addToCart(product);
  };

  return (
    <Animated.View style={[s.card, { 
      backgroundColor: colors.card,
      borderColor: colors.borderLight,
      transform: [{ scale }] 
    }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <View style={s.cardImageWrapper}>
          <Image source={{ uri: product.image }} style={s.cardImage} />
          <TouchableOpacity 
            style={[s.favBtn, { backgroundColor: inWishlist ? colors.error : 'rgba(0,0,0,0.4)' }]}
            onPress={handleWishlist}
          >
            <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={s.cardBody}>
          <Text style={[s.cardName, { color: colors.text }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[s.cardPrice, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>

          <TouchableOpacity 
            style={[s.addBtn, { backgroundColor: colors.primary }]} 
            onPress={handleAddToCart}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={s.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProductSection: React.FC<{ title: string; data: any[] }> = ({ title, data }) => {
  const router = useRouter();

  return (
    <View style={s.section}>
      <SectionHeader title={title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.sectionScroll}>
        {data.map((p) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onPress={() => router.push(`/product/${p.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function HomeTab() {
  const { colors } = useTheme();
  const { products, searchQuery } = useApp();

  // Filter products based on search query
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProducts = filteredProducts.slice(0, 6);
  const popularProducts = filteredProducts.slice(6, 12);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      <View style={s.frame}>
        {/* Fixed Header */}
        <Header />

        {/* Fixed Search */}
        <View style={s.searchWrapper}>
          <SearchBar />
        </View>

        {/* Scrollable Area */}
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          <Banner />
          {featuredProducts.length > 0 && (
            <ProductSection title="Featured Deals" data={featuredProducts} />
          )}
          {popularProducts.length > 0 && (
            <ProductSection title="Most Popular" data={popularProducts} />
          )}
          {filteredProducts.length === 0 && searchQuery && (
            <View style={s.emptyState}>
              <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
              <Text style={[s.emptyText, { color: colors.textSecondary }]}>No products found</Text>
            </View>
          )}
          <View style={s.bottomSpacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  /* Layout */
  container: { flex: 1 },
  frame: {
    width: '100%',
    flex: 1,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2 },
  welcome: { fontSize: 13, fontWeight: '500' },
  user: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', columnGap: 12 },
  iconBtn: { position: 'relative', padding: 8, borderRadius: 999 },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  cartBtn: { position: 'relative', padding: 9, borderRadius: 999 },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    backgroundColor: '#fff',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: '#6366f1', fontSize: 11, fontWeight: '700' },

  /* Search */
  searchWrapper: { paddingHorizontal: 20, paddingVertical: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },

  /* Hero Banner */
  bannerWrapper: { marginHorizontal: 20, marginVertical: 16, height: 200, borderRadius: 24, overflow: 'hidden' },
  bannerCard: { width: SCREEN_WIDTH - 80, height: 200, flexDirection: 'row', alignItems: 'center', padding: 20 },
  bannerText: { flex: 1, justifyContent: 'center' },
  bannerTag: { fontSize: 14, color: '#c4b5fd', fontWeight: '600', letterSpacing: 1 },
  bannerDiscount: { fontSize: 36, color: '#fff', fontWeight: '800', marginVertical: 4 },
  bannerSubtitle: { fontSize: 16, color: '#e5e7eb', fontWeight: '500' },
  bannerCta: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  bannerCtaText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  bannerImg: { width: 110, height: 110, borderRadius: 16, marginLeft: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },

  /* Section */
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 22, fontWeight: '700' },
  seeAll: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { fontWeight: '600', marginRight: 4 },

  sectionScroll: { paddingLeft: 12 },

  /* Product Card */
  card: {
    width: 170,
    borderRadius: 20,
    marginHorizontal: 8,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  cardImageWrapper: { position: 'relative' },
  cardImage: { width: '100%', height: 140, resizeMode: 'cover' },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 999,
  },
  cardBody: { padding: 12 },
  cardName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  cardPrice: { fontSize: 18, fontWeight: '800' },
  addBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 12,
  },
  addBtnText: { color: '#fff', marginLeft: 6, fontWeight: '600', fontSize: 13 },

  /* Misc */
  scroll: { flex: 1 },
  bottomSpacer: { height: 60 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, marginTop: 16 },
});