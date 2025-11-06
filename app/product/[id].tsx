import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { products, addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const { colors, isDark } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
        <View style={s.errorContainer}>
          <Text style={[s.errorText, { color: colors.text }]}>Product not found</Text>
          <TouchableOpacity
            style={[s.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={s.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const images = [product.image, product.image, product.image]; // Mock multiple images

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleToggleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Haptic feedback could be added here
  };

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={[s.container, { backgroundColor: colors.background }]}>
      {/* Animated Header */}
      <Animated.View
        style={[
          s.header,
          {
            backgroundColor: colors.surface,
            opacity: headerOpacity,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={s.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.text }]}>Product Details</Text>
        <TouchableOpacity onPress={handleToggleWishlist} style={s.headerButton}>
          <Ionicons
            name={inWishlist ? 'heart' : 'heart-outline'}
            size={24}
            color={inWishlist ? colors.error : colors.text}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Fixed Back Button */}
      <TouchableOpacity
        style={[s.fixedBackButton, { backgroundColor: colors.surface }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
      >
        {/* Image Gallery */}
        <View style={s.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setSelectedImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={s.productImage} />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View style={s.imageIndicators}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  s.indicator,
                  {
                    backgroundColor: index === selectedImageIndex ? colors.primary : colors.border,
                  },
                ]}
              />
            ))}
          </View>

          {/* Wishlist Button */}
          <TouchableOpacity
            style={[s.wishlistButton, { backgroundColor: colors.surface }]}
            onPress={handleToggleWishlist}
          >
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={24}
              color={inWishlist ? colors.error : colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Product Info */}
        <View style={s.content}>
          <View style={s.titleRow}>
            <Text style={[s.productName, { color: colors.text }]}>{product.name}</Text>
            {product.rating && (
              <View style={s.ratingContainer}>
                <Ionicons name="star" size={16} color={colors.warning} />
                <Text style={[s.ratingText, { color: colors.textSecondary }]}>
                  {product.rating} ({product.reviews})
                </Text>
              </View>
            )}
          </View>

          <Text style={[s.productPrice, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>

          {product.description && (
            <Text style={[s.description, { color: colors.textSecondary }]}>{product.description}</Text>
          )}

          {/* Stock Status */}
          <View style={[s.stockContainer, { backgroundColor: colors.surface }]}>
            <View style={[s.stockIndicator, { backgroundColor: product.inStock ? colors.success : colors.error }]} />
            <Text style={[s.stockText, { color: colors.text }]}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Quantity Selector */}
          <View style={s.quantitySection}>
            <Text style={[s.quantityLabel, { color: colors.text }]}>Quantity</Text>
            <View style={[s.quantityControls, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TouchableOpacity
                style={s.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </TouchableOpacity>
              <Text style={[s.quantityValue, { color: colors.text }]}>{quantity}</Text>
              <TouchableOpacity style={s.quantityButton} onPress={() => setQuantity(quantity + 1)}>
                <Ionicons name="add" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Features */}
          <View style={s.featuresSection}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>Key Features</Text>
            {['Premium Quality', 'Fast Shipping', 'Easy Returns', '1 Year Warranty'].map((feature, index) => (
              <View key={index} style={s.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={[s.featureText, { color: colors.textSecondary }]}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={[s.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={s.priceContainer}>
          <Text style={[s.totalLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[s.totalPrice, { color: colors.primary }]}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={[s.addToCartButton, { backgroundColor: product.inStock ? colors.primary : colors.textTertiary }]}
          onPress={handleAddToCart}
          disabled={!product.inStock}
        >
          <LinearGradient
            colors={product.inStock ? [colors.primary, colors.primaryDark] : [colors.textTertiary, colors.textTertiary]}
            style={s.addToCartGradient}
          >
            <Ionicons name="cart" size={20} color="#fff" />
            <Text style={s.addToCartText}>Add to Cart</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 100,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  fixedBackButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    height: SCREEN_HEIGHT * 0.5,
    position: 'relative',
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: '100%',
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  wishlistButton: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  stockIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '700',
    minWidth: 40,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceContainer: {
    flex: 1,
    marginRight: 12,
  },
  totalLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '800',
  },
  addToCartButton: {
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
  },
  addToCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

const createStyles = (colors: any, isDark: boolean) => {
  return {};
};
