import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  inStock?: boolean;
  rating?: number;
  reviews?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface AppState {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  searchQuery: string;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearCart: () => void;
  setSearchQuery: (query: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Mock products data
const mockProducts: Product[] = [
  { id: 1, name: 'Chronos Elite', price: 249, image: 'https://placehold.co/400x400/1e293b/ffffff?text=Watch', category: 'Electronics', inStock: true, rating: 4.5, reviews: 120 },
  { id: 2, name: 'Nova Runner', price: 189, image: 'https://placehold.co/400x400/0f172a/ffffff?text=Shoes', category: 'Fashion', inStock: true, rating: 4.8, reviews: 89 },
  { id: 3, name: 'AirBuds Pro', price: 299, image: 'https://placehold.co/400x400/1e3a8a/ffffff?text=EarBuds', category: 'Electronics', inStock: true, rating: 4.7, reviews: 234 },
  { id: 4, name: 'Studio Beats', price: 159, image: 'https://placehold.co/400x400/111827/ffffff?text=Headphones', category: 'Electronics', inStock: true, rating: 4.6, reviews: 156 },
  { id: 5, name: 'BoomBox Mini', price: 99, image: 'https://placehold.co/400x400/059669/ffffff?text=Speaker', category: 'Electronics', inStock: true, rating: 4.4, reviews: 67 },
  { id: 6, name: 'Leather Vault', price: 79, image: 'https://placehold.co/400x400/7c2d12/ffffff?text=Wallet', category: 'Fashion', inStock: true, rating: 4.3, reviews: 45 },
  { id: 7, name: 'OLED Vision', price: 1299, image: 'https://placehold.co/400x400/0f172a/ffffff?text=TV', category: 'Electronics', inStock: true, rating: 4.9, reviews: 312 },
  { id: 8, name: 'Cozy Hoodie', price: 59, image: 'https://placehold.co/400x400/374151/ffffff?text=Hoodie', category: 'Fashion', inStock: true, rating: 4.5, reviews: 178 },
  { id: 9, name: 'Arctic Puffer', price: 219, image: 'https://placehold.co/400x400/1e40af/ffffff?text=Jacket', category: 'Fashion', inStock: true, rating: 4.6, reviews: 92 },
  { id: 10, name: 'DSLR Pro', price: 1199, image: 'https://placehold.co/400x400/1f2937/ffffff?text=Camera', category: 'Electronics', inStock: false, rating: 4.8, reviews: 145 },
  { id: 11, name: 'Gaming Mouse', price: 89, image: 'https://placehold.co/400x400/7c3aed/ffffff?text=Mouse', category: 'Electronics', inStock: true, rating: 4.7, reviews: 203 },
  { id: 12, name: 'Eco Yoga Mat', price: 39, image: 'https://placehold.co/400x400/6b21a8/ffffff?text=Yoga', category: 'Sports', inStock: true, rating: 4.4, reviews: 56 },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load cart and wishlist from AsyncStorage on mount
  useEffect(() => {
    loadCart();
    loadWishlist();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    saveCart();
  }, [cart]);

  // Save wishlist to AsyncStorage whenever it changes
  useEffect(() => {
    saveWishlist();
  }, [wishlist]);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const saveWishlist = async () => {
    try {
      await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        searchQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearCart,
        setSearchQuery,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
