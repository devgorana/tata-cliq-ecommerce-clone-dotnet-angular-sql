import { createReducer, on } from '@ngrx/store';
import { Category, Product, ProductFilters } from '../../core/models/product.model';
import { CatalogActions } from './catalog.actions';

export interface CatalogState {
  products:        Product[];
  totalCount:      number;
  selectedProduct: Product | null;
  categories:      Category[];
  filters:         ProductFilters;
  isLoading:       boolean;
  error:           string | null;
}

const defaultFilters: ProductFilters = {
  categoryId:  null,
  brandId:     null,
  search:      null,
  minPrice:    null,
  maxPrice:    null,
  minDiscount: null,
  sort:        null,
  page:        1,
  pageSize:    24,
};

export const initialCatalogState: CatalogState = {
  products:        [],
  totalCount:      0,
  selectedProduct: null,
  categories:      [],
  filters:         defaultFilters,
  isLoading:       false,
  error:           null,
};

export const catalogReducer = createReducer(
  initialCatalogState,

  on(CatalogActions.loadProducts, CatalogActions.loadProduct,
     CatalogActions.loadCategories,
    (state) => ({ ...state, isLoading: true, error: null })),

  on(CatalogActions.loadProductsSuccess, (state, { result }) => ({
    ...state,
    isLoading:  false,
    products:   result.items,
    totalCount: result.totalCount,
  })),

  on(CatalogActions.loadProductSuccess, (state, { product }) => ({
    ...state, isLoading: false, selectedProduct: product,
  })),

  on(CatalogActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state, isLoading: false, categories,
  })),

  on(CatalogActions.loadProductsFailure, CatalogActions.loadProductFailure,
     CatalogActions.loadCategoriesFailure,
    (state, { error }) => ({ ...state, isLoading: false, error })),

  on(CatalogActions.setFilters, (state, { filters }) => ({
    ...state, filters: { ...state.filters, ...filters },
  })),

  on(CatalogActions.resetFilters, (state) => ({
    ...state, filters: defaultFilters,
  })),
);
