import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, PaginatedResult, Product, ProductFilters } from '../models/product.model';
import { CreateReviewRequest, PagedReviews, Review } from '../models/review.model';

/** Shape returned by the backend review endpoint */
interface BackendReview {
  id: string;
  productId: string;
  userId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

interface BackendPagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

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
    if (filters.minPrice != null)    params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice != null)    params = params.set('maxPrice', filters.maxPrice);
    if (filters.minDiscount != null) params = params.set('minDiscount', filters.minDiscount);
    if (filters.sort)                params = params.set('sort', filters.sort);

    return this.http.get<PaginatedResult<Product>>(`${this.base}/products`, { params });
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.base}/products/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  getReviews(productId: string, page = 1, pageSize = 10): Observable<PagedReviews> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http
      .get<BackendPagedResult<BackendReview>>(
        `${this.base}/products/${productId}/reviews`,
        { params },
      )
      .pipe(
        map((res) => ({
          items: res.items.map(mapReview),
          totalCount: res.totalCount,
          page: res.page,
          pageSize: res.pageSize,
        })),
      );
  }

  postReview(productId: string, req: CreateReviewRequest): Observable<Review> {
    return this.http
      .post<BackendReview>(`${this.base}/products/${productId}/reviews`, req)
      .pipe(map(mapReview));
  }

  getRelatedProducts(productId: string, limit = 6): Observable<Product[]> {
    const params = new HttpParams().set('limit', limit);
    return this.http.get<Product[]>(`${this.base}/products/${productId}/related`, { params });
  }
}

function mapReview(r: BackendReview): Review {
  return {
    id:        r.id,
    productId: r.productId,
    userId:    r.userId,
    author:    r.author,
    rating:    r.rating,
    title:     r.title,
    body:      r.body,
    date:      r.createdAt,
  };
}
