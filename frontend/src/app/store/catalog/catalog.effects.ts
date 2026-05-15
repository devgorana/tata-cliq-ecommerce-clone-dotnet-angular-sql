import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap, withLatestFrom } from 'rxjs';
import { CatalogService } from '../../core/services/catalog.service';
import { CatalogActions } from './catalog.actions';
import { selectProductCache } from './catalog.selectors';

export const loadProductsEffect = createEffect(
  (actions$ = inject(Actions), catalogService = inject(CatalogService)) =>
    actions$.pipe(
      ofType(CatalogActions.loadProducts),
      switchMap(({ filters }) =>
        catalogService.getProducts(filters).pipe(
          map((result) => CatalogActions.loadProductsSuccess({ result })),
          catchError((err: unknown) =>
            of(CatalogActions.loadProductsFailure({ error: extractMessage(err) }))
          ),
        )
      ),
    ),
  { functional: true },
);

export const loadProductEffect = createEffect(
  (actions$ = inject(Actions), catalogService = inject(CatalogService), store = inject(Store)) =>
    actions$.pipe(
      ofType(CatalogActions.loadProduct),
      withLatestFrom(store.select(selectProductCache)),
      switchMap(([{ id }, cache]) => {
        // Cache hit — skip HTTP call
        if (cache[id]) {
          return of(CatalogActions.loadProductSuccess({ product: cache[id] }));
        }
        return catalogService.getProduct(id).pipe(
          map((product) => CatalogActions.loadProductSuccess({ product })),
          catchError((err: unknown) => {
            const msg = extractMessage(err);
            return of(CatalogActions.loadProductFailure({ error: msg, pdpError: msg }));
          }),
        );
      }),
    ),
  { functional: true },
);

export const loadCategoriesEffect = createEffect(
  (actions$ = inject(Actions), catalogService = inject(CatalogService)) =>
    actions$.pipe(
      ofType(CatalogActions.loadCategories),
      exhaustMap(() =>
        catalogService.getCategories().pipe(
          map((categories) => CatalogActions.loadCategoriesSuccess({ categories })),
          catchError((err: unknown) =>
            of(CatalogActions.loadCategoriesFailure({ error: extractMessage(err) }))
          ),
        )
      ),
    ),
  { functional: true },
);

/**
 * Stub effect — triggers related-products load after a product is successfully loaded.
 * Full implementation in PDP-6 (backend endpoint + real HTTP call).
 */
export const loadRelatedProductsEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CatalogActions.loadProductSuccess),
      map(({ product }) => CatalogActions.loadRelatedProducts({ id: product.id })),
    ),
  { functional: true },
);

export const fetchRelatedProductsEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(CatalogActions.loadRelatedProducts),
      // Stub: return empty list until PDP-6 backend endpoint is ready
      map(() => CatalogActions.loadRelatedProductsSuccess({ products: [] })),
    ),
  { functional: true },
);

function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}
