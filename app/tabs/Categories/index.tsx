import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_WIDTH - 60) / NUM_COLUMNS;

/* ────────────────────── Mock Categories Data ────────────────────── */
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
const CategoriesHeader = () => {
  const { colors } = useTheme();
  return (
    <View style={s.header}>
      <Text style={[s.headerTitle, { color: colors.text }]}>Categories</Text>
      <Text style={[s.headerSubtitle, { color: colors.textSecondary }]}>Explore our collections</Text>
    </View>
  );
};

const SearchBar = () => {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const { colors } = useTheme();

  return (
    <View style={[s.searchContainer, { 
      backgroundColor: colors.surface,
      borderColor: focused ? colors.primary : colors.border 
    }]}>
      <Ionicons name="search" size={20} color={focused ? colors.primary : colors.textSecondary} />
      <TextInput
        placeholder="Search categories…"
        placeholderTextColor={colors.textSecondary}
        style={[s.searchInput, { color: colors.text }]}
        value={query}
        onChangeText={setQuery}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && query && (
        <TouchableOpacity onPress={() => { setFocused(false); setQuery(''); }}>
          <Ionicons name="close" size={20} color={colors.primary} />
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
  const { colors } = useTheme();
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
      style={[s.card, { 
        backgroundColor: colors.card,
        borderColor: colors.borderLight 
      }]}
      onPress={() => onPress(category.id)}
    >
      <LinearGradient
        colors={['rgba(99,102,241,0.1)', 'rgba(99,102,241,0.05)']}
        style={s.cardGradient}
      >
        <View style={s.cardHeader}>
          <View style={[s.iconWrapper, { backgroundColor: colors.surface }]}>
            <Ionicons name={category.icon} size={28} color={colors.primary} />
          </View>
          <Text style={[s.cardName, { color: colors.text }]}>{category.name}</Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.textSecondary}
            style={s.expandIcon}
          />
        </View>
        <Image source={{ uri: category.image }} style={s.cardImage} />
      </LinearGradient>

      <Animated.View style={[s.subCategories, { height: subHeight }]}>
        {category.subCategories.map((sub, index) => (
          <TouchableOpacity key={index} style={[s.subItem, { borderBottomColor: colors.border }]}>
            <Text style={[s.subText, { color: colors.textSecondary }]}>{sub}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>
    </TouchableOpacity>
  );
};

/* ────────────────────── Main Screen ────────────────────── */
export default function CategoriesTab() {
  const { colors } = useTheme();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
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
    </SafeAreaView>
  );
}

/* ────────────────────── Styles ────────────────────── */
const s = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 40 },

  /* Header */
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '700' },
  headerSubtitle: { fontSize: 14, marginTop: 4 },

  /* Search */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },

  /* Category Card */
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    margin: 8,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconWrapper: {
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  cardName: { flex: 1, fontSize: 16, fontWeight: '600' },
  expandIcon: { marginLeft: 8 },
  cardImage: { width: '100%', height: 100, borderRadius: 12 },
  subCategories: { overflow: 'hidden', paddingHorizontal: 16 },
  subItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  subText: { fontSize: 14 },
});