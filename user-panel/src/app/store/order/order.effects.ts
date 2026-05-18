import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { OrderActions } from './order.actions';

export const buyNowEffect = createEffect(
  (actions$ = inject(Actions), orderService = inject(OrderService)) =>
    actions$.pipe(
      ofType(OrderActions.buyNow),
      exhaustMap(({ productId, size, colour, quantity }) =>
        orderService.buyNow(productId, size, colour, quantity).pipe(
          map((order) => OrderActions.buyNowSuccess({
            orderId:     order.id,
            orderNumber: order.orderNumber,
          })),
          catchError((err: unknown) =>
            of(OrderActions.buyNowFailure({ error: extractMessage(err) }))
          ),
        )
      ),
    ),
  { functional: true },
);

export const buyNowSuccessRedirectEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(OrderActions.buyNowSuccess),
      tap(({ orderNumber }) =>
        router.navigate(['/order-confirmed'], { queryParams: { orderNumber } })
      ),
    ),
  { functional: true, dispatch: false },
);

function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && 'error' in err) {
    const e = (err as { error: unknown }).error;
    if (typeof e === 'object' && e !== null && 'message' in e) {
      const msg = (e as Record<string, unknown>)['message'];
      if (typeof msg === 'string') return msg;
    }
  }
  return 'Failed to place order';
}
