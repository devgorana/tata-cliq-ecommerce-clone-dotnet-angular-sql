import { createReducer, on } from '@ngrx/store';
import { Cart } from '../../core/models/cart.model';
import { CartActions } from './cart.actions';

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  cart:      null,
  isLoading: false,
  error:     null,
};

const emptyCart: Cart = {
  items:      [],
  subtotal:   0,
  discount:   0,
  total:      0,
  couponCode: null,
};

export const cartReducer = createReducer(
  initialCartState,

  on(CartActions.loadCart, CartActions.addItem, CartActions.updateItem,
     CartActions.removeItem, CartActions.applyCoupon,
    (state) => ({ ...state, isLoading: true, error: null })),

  on(CartActions.loadCartSuccess, CartActions.applyCouponSuccess, (state, { cart }) => ({
    ...state, isLoading: false, cart,
  })),

  on(CartActions.addItemSuccess, (state, { item }) => {
    const cart = state.cart ?? { ...emptyCart };
    const existing = cart.items.find((i) => i.id === item.id);
    const items = existing
      ? cart.items.map((i) => (i.id === item.id ? item : i))
      : [...cart.items, item];
    return { ...state, isLoading: false, cart: recalculate({ ...cart, items }) };
  }),

  on(CartActions.updateItemSuccess, (state, { item }) => {
    const cart = state.cart ?? { ...emptyCart };
    const items = cart.items.map((i) => (i.id === item.id ? item : i));
    return { ...state, isLoading: false, cart: recalculate({ ...cart, items }) };
  }),

  on(CartActions.removeItemSuccess, (state, { itemId }) => {
    const cart = state.cart ?? { ...emptyCart };
    const items = cart.items.filter((i) => i.id !== itemId);
    return { ...state, isLoading: false, cart: recalculate({ ...cart, items }) };
  }),

  on(CartActions.loadCartFailure, CartActions.addItemFailure,
     CartActions.updateItemFailure, CartActions.removeItemFailure,
     CartActions.applyCouponFailure,
    (state, { error }) => ({ ...state, isLoading: false, error })),

  on(CartActions.clearCart, (state) => ({ ...state, cart: { ...emptyCart } })),
);

function recalculate(cart: Cart): Cart {
  const subtotal = cart.items.reduce(
    (sum, i) => sum + (i.salePrice ?? i.price) * i.quantity, 0,
  );
  return { ...cart, subtotal, total: subtotal - cart.discount };
}
