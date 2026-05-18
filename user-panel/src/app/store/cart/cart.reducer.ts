import { createReducer, on } from '@ngrx/store';
import { Cart, CartItem } from '../../core/models/cart.model';
import { CartActions } from './cart.actions';

const SAVED_KEY = 'cliq_saved_for_later';

function loadSaved(): CartItem[] {
  try {
    return JSON.parse(sessionStorage.getItem(SAVED_KEY) ?? '[]') as CartItem[];
  } catch {
    return [];
  }
}

function persistSaved(items: CartItem[]): void {
  sessionStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  couponStatus: 'idle' | 'success' | 'error';
  couponMessage: string | null;
  savedForLater: CartItem[];
}

export const initialCartState: CartState = {
  cart:          null,
  isLoading:     false,
  error:         null,
  couponStatus:  'idle',
  couponMessage: null,
  savedForLater: loadSaved(),
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

  on(CartActions.loadCartSuccess, (state, { cart }) => ({
    ...state, isLoading: false, cart,
  })),

  on(CartActions.applyCouponSuccess, (state, { cart }) => ({
    ...state, isLoading: false, cart,
    couponStatus: 'success' as const,
    couponMessage: cart.couponCode ? `Coupon "${cart.couponCode}" applied! You save ₹${cart.discount.toFixed(0)}` : 'Coupon applied!',
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
    (state, { error }) => ({ ...state, isLoading: false, error })),

  on(CartActions.applyCouponFailure, (state, { error }) => ({
    ...state, isLoading: false, error,
    couponStatus: 'error' as const,
    couponMessage: 'Invalid or expired coupon code.',
  })),

  on(CartActions.saveForLater, (state, { itemId }) => {
    const cart = state.cart ?? { ...emptyCart };
    const item = cart.items.find((i) => i.id === itemId);
    if (!item) return state;
    const items = cart.items.filter((i) => i.id !== itemId);
    const savedForLater = [item, ...state.savedForLater.filter((s) => s.id !== itemId)];
    persistSaved(savedForLater);
    return { ...state, cart: recalculate({ ...cart, items }), savedForLater };
  }),

  on(CartActions.moveToCart, (state, { item }) => {
    const cart = state.cart ?? { ...emptyCart };
    const savedForLater = state.savedForLater.filter((s) => s.id !== item.id);
    const existing = cart.items.find((i) => i.id === item.id);
    const items = existing
      ? cart.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...cart.items, item];
    persistSaved(savedForLater);
    return { ...state, cart: recalculate({ ...cart, items }), savedForLater };
  }),

  on(CartActions.removeSaved, (state, { itemId }) => {
    const savedForLater = state.savedForLater.filter((s) => s.id !== itemId);
    persistSaved(savedForLater);
    return { ...state, savedForLater };
  }),

  on(CartActions.clearCart, (state) => ({ ...state, cart: { ...emptyCart } })),
);

function recalculate(cart: Cart): Cart {
  const subtotal = cart.items.reduce(
    (sum, i) => sum + (i.salePrice ?? i.price) * i.quantity, 0,
  );
  return { ...cart, subtotal, total: subtotal - cart.discount };
}
