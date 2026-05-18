import { createActionGroup, props } from '@ngrx/store';

export const OrderActions = createActionGroup({
  source: 'Order',
  events: {
    'Buy Now':         props<{ productId: string; size: string | null; colour: string | null; quantity: number }>(),
    'Buy Now Success': props<{ orderNumber: string; orderId: string }>(),
    'Buy Now Failure': props<{ error: string }>(),
  },
});
