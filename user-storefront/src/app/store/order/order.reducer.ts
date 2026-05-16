import { createReducer, on } from '@ngrx/store';
import { OrderActions } from './order.actions';

export interface OrderState {
  isLoading:   boolean;
  error:       string | null;
  lastOrderId: string | null;
}

export const initialOrderState: OrderState = {
  isLoading:   false,
  error:       null,
  lastOrderId: null,
};

export const orderReducer = createReducer(
  initialOrderState,

  on(OrderActions.buyNow, (state) => ({ ...state, isLoading: true, error: null })),

  on(OrderActions.buyNowSuccess, (state, { orderId }) => ({
    ...state, isLoading: false, lastOrderId: orderId,
  })),

  on(OrderActions.buyNowFailure, (state, { error }) => ({
    ...state, isLoading: false, error,
  })),
);
