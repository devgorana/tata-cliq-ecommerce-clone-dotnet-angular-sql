import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Category, PaginatedResult, Product, ProductFilters } from '../../core/models/product.model';

export const CatalogActions = createActionGroup({
  source: 'Catalog',
  events: {
    'Load Products':         props<{ filters: ProductFilters }>(),
    'Load Products Success': props<{ result: PaginatedResult<Product> }>(),
    'Load Products Failure': props<{ error: string }>(),

    'Load Product':         props<{ id: string }>(),
    'Load Product Success': props<{ product: Product }>(),
    'Load Product Failure': props<{ error: string }>(),

    'Load Categories':         emptyProps(),
    'Load Categories Success': props<{ categories: Category[] }>(),
    'Load Categories Failure': props<{ error: string }>(),

    'Set Filters':   props<{ filters: Partial<ProductFilters> }>(),
    'Reset Filters': emptyProps(),
  },
});
