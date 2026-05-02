import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { CatalogService } from '../../core/services/catalog.service';
import { CatalogActions } from './catalog.actions';

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
  (actions$ = inject(Actions), catalogService = inject(CatalogService)) =>
    actions$.pipe(
      ofType(CatalogActions.loadProduct),
      exhaustMap(({ id }) =>
        catalogService.getProduct(id).pipe(
          map((product) => CatalogActions.loadProductSuccess({ product })),
          catchError((err: unknown) =>
            of(CatalogActions.loadProductFailure({ error: extractMessage(err) }))
          ),
        )
      ),
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

function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'An unexpected error occurred';
}
