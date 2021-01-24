import React, { useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    if (!products) {
      return formatValue(0);
    }

    let initialCost = 0;

    const sumReducer = (accumulator: number, product: Product) => {
      const productsSubtotal = product.price * product.quantity;
      return accumulator + productsSubtotal;
    };

    const sum = products.reduce(sumReducer, initialCost)

    return formatValue(sum);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    if (!products) {
      return 0;
    }

    let initialAmountOfItems = 0;

    const itemsReducer = (accumulator: number, product: Product) => {
      return accumulator + product.quantity;
    };

    const totalItems = products.reduce(itemsReducer, initialAmountOfItems)

    return totalItems;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
