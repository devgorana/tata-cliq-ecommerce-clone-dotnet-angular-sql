import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { CartActions } from './cart.actions';

export const loadCartEffect = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() =>
        cartService.getCart().pipe(
          map((cart) => CartActions.loadCartSuccess({ cart })),
          catchError((err: unknown) => of(CartActions.loadCartFailure({ error: extractMessage(err) }))),
        )
      ),
    ),
  { functional: true },
);

export const addItemEffect = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.addItem),
      exhaustMap(({ productId, variantId, quantity }) =>
        cartService.addItem(productId, variantId, quantity).pipe(
          map((item) => CartActions.addItemSuccess({ item })),
          catchError((err: unknown) => of(CartActions.addItemFailure({ error: extractMessage(err) }))),
        )
      ),
    ),
  { functional: true },
);

export const updateItemEffect = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.updateItem),
      exhaustMap(({ itemId, quantity }) =>
        cartService.updateItem(itemId, quantity).pipe(
          map((item) => CartActions.updateItemSuccess({ item })),
          catchError((err: unknown) => of(CartActions.updateItemFailure({ error: extractMessage(err) }))),
        )
      ),
    ),
  { functional: true },
);

export const removeItemEffect = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.removeItem),
      exhaustMap(({ itemId }) =>
        cartService.removeItem(itemId).pipe(
          map(() => CartActions.removeItemSuccess({ itemId })),
          catchError((err: unknown) => of(CartActions.removeItemFailure({ error: extractMessage(err) }))),
        )
      ),
    ),
  { functional: true },
);

export const applyCouponEffect = createEffect(
  (actions$ = inject(Actions), cartService = inject(CartService)) =>
    actions$.pipe(
      ofType(CartActions.applyCoupon),
      exhaustMap(({ couponCode }) =>
        cartService.applyCoupon(couponCode).pipe(
          map((cart) => CartActions.applyCouponSuccess({ cart })),
          catchError((err: unknown) => of(CartActions.applyCouponFailure({ error: extractMessage(err) }))),
        )
      ),
    ),
  { functional: true },
);

function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}
