import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsFromStorage = await AsyncStorage.getItem('@GoMarketplace:cart')

      if (productsFromStorage) {
        setProducts([...JSON.parse(productsFromStorage)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    const isProductInCart = products.find(item => item.id === product.id);

    let itemsInCart: Product[];

    if (isProductInCart) {
      itemsInCart = products.map(item => item.id === product.id
        ? { ...product, quantity: item.quantity + 1 }
        : item);
    } else {
      itemsInCart = [...products, { ...product, quantity: 1 }];
    }

    setProducts(itemsInCart);

    await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(itemsInCart));
  }, [products]);

  const increment = useCallback(async id => {
    const productsInCart = products.map(
      product => product.id === id
        ? { ...product, quantity: product.quantity + 1 }
        : product
    );

    setProducts(productsInCart)

    await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(productsInCart));
  }, [products]);

  const decrement = useCallback(async id => {
    const productsInCart = products.map(
      product => product.id === id
        ? { ...product, quantity: product.quantity > 0 ? product.quantity - 1 : 0 }
        : product
    );

    // ADD - DEPOIS DA NOTA
    // const productsInCart = products.map(
    //   product => product.id === id
    //     ? { ...product, quantity: product.quantity - 1 }
    //     : product
    // ).filter(product => product.quantity > 1);

    setProducts(productsInCart)

    await AsyncStorage.setItem('@GoMarketplace:cart', JSON.stringify(productsInCart));
  }, [products]);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
