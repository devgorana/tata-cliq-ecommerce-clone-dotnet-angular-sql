import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CatalogState } from './catalog.reducer';

export const selectCatalogState  = createFeatureSelector<CatalogState>('catalog');

export const selectProducts        = createSelector(selectCatalogState, (s) => s.products);
export const selectTotalCount      = createSelector(selectCatalogState, (s) => s.totalCount);
export const selectSelectedProduct = createSelector(selectCatalogState, (s) => s.selectedProduct);
export const selectCategories      = createSelector(selectCatalogState, (s) => s.categories);
export const selectFilters         = createSelector(selectCatalogState, (s) => s.filters);
export const selectCatalogLoading  = createSelector(selectCatalogState, (s) => s.isLoading);
export const selectCatalogError    = createSelector(selectCatalogState, (s) => s.error);
