import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface SellerProfile {
  id: string;
  storeName: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  status: string;
  commissionRate: number;
}

export interface SellerDashboard {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
}

export interface SellerProduct {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  discountedPrice: number | null;
  categoryName: string;
  brandName: string;
  isActive: boolean;
  stockQuantity: number;
}

export interface InventoryItem {
  id: string;
  productVariantId: string;
  productName: string;
  size: string;
  colour: string | null;
  stock: number;
  price: number;
  lowStockThreshold: number;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

export interface SellerAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{ productName: string; unitsSold: number; revenue: number }>;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class SellerApiService {
  private http = inject(HttpClient);
  private base = '/api/v1/seller';

  getProfile(): Observable<SellerProfile> {
    return this.http.get<SellerProfile>(`${this.base}/profile`);
  }

  updateProfile(data: Partial<SellerProfile>): Observable<SellerProfile> {
    return this.http.put<SellerProfile>(`${this.base}/profile`, data);
  }

  getDashboard(): Observable<SellerDashboard> {
    return this.http.get<SellerDashboard>(`${this.base}/dashboard`);
  }

  getAnalytics(): Observable<SellerAnalytics> {
    return this.http.get<SellerAnalytics>(`${this.base}/analytics`);
  }

  getProducts(page = 1, pageSize = 20): Observable<PagedResult<SellerProduct>> {
    return this.http.get<PagedResult<SellerProduct>>(`${this.base}/products`, {
      params: new HttpParams().set('page', page).set('pageSize', pageSize),
    });
  }

  getInventory(page = 1, pageSize = 20): Observable<PagedResult<InventoryItem>> {
    return this.http.get<PagedResult<InventoryItem>>(`${this.base}/inventory`, {
      params: new HttpParams().set('page', page).set('pageSize', pageSize),
    });
  }

  updateInventory(id: string, stock: number, price: number): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(`${this.base}/inventory/${id}`, { stock, price });
  }

  getOrders(page = 1, pageSize = 20): Observable<PagedResult<SellerOrder>> {
    return this.http.get<PagedResult<SellerOrder>>(`${this.base}/orders`, {
      params: new HttpParams().set('page', page).set('pageSize', pageSize),
    });
  }

  updateOrderStatus(orderId: string, status: string): Observable<void> {
    return this.http.put<void>(`${this.base}/orders/${orderId}/status`, { status });
  }
}
