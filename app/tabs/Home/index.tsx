import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
} from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ────────────────────── Mock Data ────────────────────── */
const featuredProducts = [
  { id: 1, name: 'Chronos Elite', price: '$249', image: 'https://placehold.co/400x400/1e293b/ffffff?text=Watch' },
  { id: 2, name: 'Nova Runner', price: '$189', image: 'https://placehold.co/400x400/0f172a/ffffff?text=Shoes' },
  { id: 3, name: 'AirBuds Pro', price: '$299', image: 'https://placehold.co/400x400/1e3a8a/ffffff?text=EarBuds' },
  { id: 4, name: 'Studio Beats', price: '$159', image: 'https://placehold.co/400x400/111827/ffffff?text=Headphones' },
  { id: 5, name: 'BoomBox Mini', price: '$99', image: 'https://placehold.co/400x400/059669/ffffff?text=Speaker' },
  { id: 6, name: 'Leather Vault', price: '$79', image: 'https://placehold.co/400x400/7c2d12/ffffff?text=Wallet' },
];

const popularProducts = [
  { id: 7, name: 'OLED Vision', price: '$1,299', image: 'https://placehold.co/400x400/0f172a/ffffff?text=TV' },
  { id: 8, name: 'Cozy Hoodie', price: '$59', image: 'https://placehold.co/400x400/374151/ffffff?text=Hoodie' },
  { id: 9, name: 'Arctic Puffer', price: '$219', image: 'https://placehold.co/400x400/1e40af/ffffff?text=Jacket' },
  { id: 10, name: 'DSLR Pro', price: '$1,199', image: 'https://placehold.co/400x400/1f2937/ffffff?text=Camera' },
  { id: 11, name: 'Gaming Mouse', price: '$89', image: 'https://placehold.co/400x400/7c3aed/ffffff?text=Mouse' },
  { id: 12, name: 'Eco Yoga Mat', price: '$39', image: 'https://placehold.co/400x400/6b21a8/ffffff?text=Yoga' },
];

/* ────────────────────── Reusable Components ────────────────────── */
export const Header = () => {
  const [cartCount] = useState(3); // demo

  return (
    <View style={s.header}>
      <View style={s.headerLeft}>
        <Image source={{ uri: 'https://placehold.co/56x56/6366f1/fff?text=JW' }} style={s.avatar} />
        <View>
          <Text style={s.welcome}>Welcome back,</Text>
          <Text style={s.user}>John William</Text>
        </View>
      </View>

      <View style={s.headerRight}>
        <TouchableOpacity style={s.iconBtn}>
          <Ionicons name="notifications-outline" size={24} color="#e5e7eb" />
          <View style={s.badge} />
        </TouchableOpacity>

        <TouchableOpacity style={s.cartBtn}>
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

  return (
    <View style={[s.searchContainer, focused && s.searchFocused]}>
      <Ionicons name="search" size={20} color={focused ? '#6366f1' : '#9ca3af'} />
      <TextInput
        placeholder="Search products, brands…"
        placeholderTextColor="#9ca3af"
        style={s.searchInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && (
        <TouchableOpacity onPress={() => setFocused(false)}>
          <Ionicons name="close" size={20} color="#6366f1" />
        </TouchableOpacity>
      )}
    </View>
  );
};

/* Hero Banner Carousel */
const Banner = () => {
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
            <Animated.View key={i} style={[s.dot, { width: dotWidth, opacity }]} />
          );
        })}
      </View>
    </View>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <View style={s.sectionHeader}>
    <Text style={s.sectionTitle}>{title}</Text>
    <TouchableOpacity style={s.seeAll}>
      <Text style={s.seeAllText}>See All</Text>
      <Ionicons name="chevron-forward" size={16} color="#6366f1" />
    </TouchableOpacity>
  </View>
);

const ProductCard: React.FC<{ product: typeof featuredProducts[number]; onAdd: () => void }> = ({
  product,
  onAdd,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    onAdd();
  };

  return (
    <Animated.View style={[s.card, { transform: [{ scale }] }]}>
      <TouchableOpacity activeOpacity={0.9} onPress={animatePress}>
        <View style={s.cardImageWrapper}>
          <Image source={{ uri: product.image }} style={s.cardImage} />
          <TouchableOpacity style={s.favBtn}>
            <Ionicons name="heart-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={s.cardBody}>
          <Text style={s.cardName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={s.cardPrice}>{product.price}</Text>

          <TouchableOpacity style={s.addBtn} onPress={animatePress}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={s.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProductSection: React.FC<{ title: string; data: typeof featuredProducts }> = ({ title, data }) => {
  const [cart, setCart] = useState<number[]>([]);

  const handleAdd = (id: number) => {
    setCart((c) => (c.includes(id) ? c : [...c, id]));
    // You could dispatch to a global cart context here
  };

  return (
    <View style={s.section}>
      <SectionHeader title={title} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.sectionScroll}>
        {data.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={() => handleAdd(p.id)} />
        ))}
      </ScrollView>
    </View>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function HomeTab() {
  return (
    <View style={s.container}>
      {/* Mobile Frame */}
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
          <ProductSection title="Featured Deals" data={featuredProducts} />
          <ProductSection title="Most Popular" data={popularProducts} />
          <View style={s.bottomSpacer} />
        </ScrollView>
      </View>
    </View>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  /* Layout */
  container: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center' },
  frame: {
    width: '100%',
    maxWidth: 448,
    backgroundColor: '#111827',
    flex: 1,
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#6366f1' },
  welcome: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  user: { fontSize: 20, color: '#fff', fontWeight: '700', letterSpacing: -0.3 },
  headerRight: { flexDirection: 'row', columnGap: 12 },
  iconBtn: { position: 'relative', padding: 8, backgroundColor: '#1f2937', borderRadius: 999 },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    backgroundColor: '#ef4444',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#111827',
  },
  cartBtn: { position: 'relative', padding: 9, backgroundColor: '#6366f1', borderRadius: 999 },
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
    backgroundColor: '#1f2937',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  searchFocused: { borderColor: '#6366f1', backgroundColor: '#111827' },
  searchInput: { flex: 1, marginLeft: 10, color: '#e5e7eb', fontSize: 15 },

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
  dot: { height: 8, borderRadius: 4, backgroundColor: '#6366f1', marginHorizontal: 4 },

  /* Section */
  section: { marginBottom: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 22, color: '#fff', fontWeight: '700' },
  seeAll: { flexDirection: 'row', alignItems: 'center' },
  seeAllText: { color: '#6366f1', fontWeight: '600', marginRight: 4 },

  sectionScroll: { paddingLeft: 12 },

  /* Product Card (Glassmorphic) */
  card: {
    width: 170,
    backgroundColor: 'rgba(31, 41, 55, 0.45)',
    borderRadius: 20,
    marginHorizontal: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  cardImageWrapper: { position: 'relative' },
  cardImage: { width: '100%', height: 140, resizeMode: 'cover' },
  favBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 999,
  },
  cardBody: { padding: 12 },
  cardName: { color: '#e5e7eb', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  cardPrice: { color: '#a78bfa', fontSize: 18, fontWeight: '800' },
  addBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 6,
    borderRadius: 12,
  },
  addBtnText: { color: '#fff', marginLeft: 6, fontWeight: '600', fontSize: 13 },

  /* Misc */
  scroll: { flex: 1 },
  bottomSpacer: { height: 60 },
});