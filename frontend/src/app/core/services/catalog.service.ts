import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, PaginatedResult, Product, ProductFilters } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.catalogApiUrl;

  getProducts(filters: ProductFilters): Observable<PaginatedResult<Product>> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('pageSize', filters.pageSize);

    if (filters.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters.brandId)    params = params.set('brandId', filters.brandId);
    if (filters.search)     params = params.set('search', filters.search);
    if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice);
    if (filters.sort)       params = params.set('sort', filters.sort);

    return this.http.get<PaginatedResult<Product>>(`${this.base}/products`, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }
}
