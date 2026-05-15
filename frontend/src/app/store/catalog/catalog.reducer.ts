import { createReducer, on } from '@ngrx/store';
import { Category, Product, ProductFilters } from '../../core/models/product.model';
import { CatalogActions } from './catalog.actions';

export interface CatalogState {
  products:          Product[];
  totalCount:        number;
  selectedProduct:   Product | null;
  categories:        Category[];
  filters:           ProductFilters;
  /** Loading flag for the PLP (product list) */
  isLoadingProducts: boolean;
  /** Loading flag for the PDP (single product) */
  isLoadingProduct:  boolean;
  /** General list/category error */
  error:             string | null;
  /** PDP-specific error — separate from list error */
  pdpError:          string | null;
  /** Per-product cache — keyed by product id */
  productCache:      Record<string, Product>;
  /** Related products for the currently viewed PDP */
  relatedProducts:   Product[];
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
  products:          [],
  totalCount:        0,
  selectedProduct:   null,
  categories:        [],
  filters:           defaultFilters,
  isLoadingProducts: false,
  isLoadingProduct:  false,
  error:             null,
  pdpError:          null,
  productCache:      {},
  relatedProducts:   [],
};

export const catalogReducer = createReducer(
  initialCatalogState,

  // ── PLP loading ──────────────────────────────────────────────────────────
  on(CatalogActions.loadProducts, (state) => ({
    ...state, isLoadingProducts: true, error: null,
  })),

  on(CatalogActions.loadProductsSuccess, (state, { result }) => ({
    ...state,
    isLoadingProducts: false,
    products:          result.items,
    totalCount:        result.totalCount,
  })),

  on(CatalogActions.loadProductsFailure, (state, { error }) => ({
    ...state, isLoadingProducts: false, error,
  })),

  // ── PDP loading ──────────────────────────────────────────────────────────
  on(CatalogActions.loadProduct, (state) => ({
    ...state, isLoadingProduct: true, pdpError: null,
  })),

  on(CatalogActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    isLoadingProduct: false,
    selectedProduct:  product,
    // Populate cache on every successful load
    productCache: { ...state.productCache, [product.id]: product },
  })),

  on(CatalogActions.loadProductFailure, (state, { pdpError }) => ({
    ...state, isLoadingProduct: false, pdpError,
  })),

  on(CatalogActions.clearSelectedProduct, (state) => ({
    ...state, selectedProduct: null, relatedProducts: [], pdpError: null,
  })),

  // ── Categories ───────────────────────────────────────────────────────────
  on(CatalogActions.loadCategories, (state) => ({
    ...state, isLoadingProducts: true, error: null,
  })),

  on(CatalogActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state, isLoadingProducts: false, categories,
  })),

  on(CatalogActions.loadCategoriesFailure, (state, { error }) => ({
    ...state, isLoadingProducts: false, error,
  })),

  // ── Related products ─────────────────────────────────────────────────────
  on(CatalogActions.loadRelatedProducts, (state) => ({
    ...state, relatedProducts: [],
  })),

  on(CatalogActions.loadRelatedProductsSuccess, (state, { products }) => ({
    ...state, relatedProducts: products,
  })),

  on(CatalogActions.loadRelatedProductsFailure, (state) => ({
    ...state, relatedProducts: [],
  })),

  // ── Filters ──────────────────────────────────────────────────────────────
  on(CatalogActions.setFilters, (state, { filters }) => ({
    ...state, filters: { ...state.filters, ...filters },
  })),

  on(CatalogActions.resetFilters, (state) => ({
    ...state, filters: defaultFilters,
  })),
);
