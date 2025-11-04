/**
 * CategoriesTab – Fully customized e-commerce categories screen
 * Expo + React-Native + TypeScript + Dark Theme
 * Matches the HomeTab and CartTab design: Dark slate + purple accents
 * Features: Grid layout with glassy cards, search, expandable sub-categories
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
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_WIDTH - 60) / NUM_COLUMNS; // Padding adjusted

/* ────────────────────── Mock Categories Data ────────────────────── */
// In a real app, fetch from API
const categories = [
  {
    id: 1,
    name: 'Electronics',
    icon: 'laptop-outline',
    image: 'https://placehold.co/400x400/1e3a8a/ffffff?text=Electronics',
    subCategories: ['Phones', 'Laptops', 'Headphones', 'Cameras'],
  },
  {
    id: 2,
    name: 'Fashion',
    icon: 'shirt-outline',
    image: 'https://placehold.co/400x400/7c3aed/ffffff?text=Fashion',
    subCategories: ['Men', 'Women', 'Kids', 'Accessories'],
  },
  {
    id: 3,
    name: 'Home & Kitchen',
    icon: 'home-outline',
    image: 'https://placehold.co/400x400/059669/ffffff?text=Home',
    subCategories: ['Furniture', 'Appliances', 'Decor', 'Cookware'],
  },
  {
    id: 4,
    name: 'Beauty',
    icon: 'sparkles-outline',
    image: 'https://placehold.co/400x400/a78bfa/ffffff?text=Beauty',
    subCategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrances'],
  },
  {
    id: 5,
    name: 'Sports',
    icon: 'fitness-outline',
    image: 'https://placehold.co/400x400/ef4444/ffffff?text=Sports',
    subCategories: ['Gym', 'Outdoor', 'Cycling', 'Team Sports'],
  },
  {
    id: 6,
    name: 'Books',
    icon: 'book-outline',
    image: 'https://placehold.co/400x400/6b7280/ffffff?text=Books',
    subCategories: ['Fiction', 'Non-Fiction', 'Comics', 'Education'],
  },
];

/* ────────────────────── Reusable Components ────────────────────── */
const CategoriesHeader = () => (
  <View style={s.header}>
    <Text style={s.headerTitle}>Categories</Text>
    <Text style={s.headerSubtitle}>Explore our collections</Text>
  </View>
);

const SearchBar = () => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[s.searchContainer, focused && s.searchFocused]}>
      <Ionicons name="search" size={20} color={focused ? '#6366f1' : '#9ca3af'} />
      <TextInput
        placeholder="Search categories…"
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

const CategoryCard: React.FC<{
  category: typeof categories[number];
  onPress: (id: number) => void;
  expanded: boolean;
}> = ({ category, onPress, expanded }) => {
  const heightAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const subHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, category.subCategories.length * 40],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={s.card}
      onPress={() => onPress(category.id)}
    >
      <LinearGradient
        colors={['rgba(99,102,241,0.1)', 'rgba(99,102,241,0.05)']}
        style={s.cardGradient}
      >
        <View style={s.cardHeader}>
          <View style={s.iconWrapper}>
            <Ionicons name={category.icon} size={28} color="#6366f1" />
          </View>
          <Text style={s.cardName}>{category.name}</Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#9ca3af"
            style={s.expandIcon}
          />
        </View>
        <Image source={{ uri: category.image }} style={s.cardImage} />
      </LinearGradient>

      <Animated.View style={[s.subCategories, { height: subHeight }]}>
        {category.subCategories.map((sub, index) => (
          <TouchableOpacity key={index} style={s.subItem}>
            <Text style={s.subText}>{sub}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </TouchableOpacity>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function CategoriesTab() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={s.container}>
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            onPress={toggleExpand}
            expanded={expandedId === item.id}
          />
        )}
        numColumns={NUM_COLUMNS}
        ListHeaderComponent={
          <>
            <CategoriesHeader />
            <SearchBar />
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
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#9ca3af', marginTop: 4 },

  /* Search */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 24,
  },
  searchFocused: { borderColor: '#6366f1', backgroundColor: '#111827' },
  searchInput: { flex: 1, marginLeft: 10, color: '#e5e7eb', fontSize: 15 },

  /* Category Card */
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 20,
    margin: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconWrapper: {
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  cardName: { flex: 1, fontSize: 16, fontWeight: '600', color: '#e5e7eb' },
  expandIcon: { marginLeft: 8 },
  cardImage: { width: '100%', height: 100, borderRadius: 12 },

  subCategories: { overflow: 'hidden', paddingHorizontal: 16 },
  subItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  subText: { color: '#9ca3af', fontSize: 14 },
});