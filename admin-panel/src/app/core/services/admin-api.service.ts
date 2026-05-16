import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  totalSellers: number;
  pendingSellers: number;
  totalBrands: number;
  totalCategories: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  userEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  itemCount: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  emailConfirmed: boolean;
  createdAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  brandName: string;
  categoryName: string;
  price: number;
  inStock: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface SellerSummary {
  id: string;
  storeName: string;
  email: string;
  status: string;
  commissionRate: number;
  productCount: number;
  createdAt: string;
}

export interface AdminStaff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private http = inject(HttpClient);
  private base = '/api/v1/admin';

  // Dashboard
  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.base}/dashboard/metrics`);
  }

  getRevenue(days = 30): Observable<RevenueData[]> {
    return this.http.get<RevenueData[]>(`${this.base}/dashboard/revenue`, {
      params: new HttpParams().set('days', days),
    });
  }

  // Orders
  getOrders(page = 1, pageSize = 20): Observable<PagedResult<AdminOrder>> {
    return this.http.get<PagedResult<AdminOrder>>(`${this.base}/orders`, {
      params: new HttpParams().set('page', page).set('pageSize', pageSize),
    });
  }

  updateOrderStatus(id: string, status: string): Observable<AdminOrder> {
    return this.http.put<AdminOrder>(`${this.base}/orders/${id}/status`, { status });
  }

  // Products
  getProducts(page = 1, pageSize = 20): Observable<PagedResult<AdminProduct>> {
    return this.http.get<PagedResult<AdminProduct>>(`${this.base}/products`, {
      params: new HttpParams().set('page', page).set('pageSize', pageSize),
    });
  }

  updateProductStatus(id: string, isActive: boolean): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(`${this.base}/products/${id}/status`, { isActive });
  }

  // Users
  getUsers(page = 1, pageSize = 20): Observable<PagedResult<AdminUser>> {
    return this.http.get<PagedResult<AdminUser>>(`${this.base}/users`, {
      params: new HttpParams().set('page', page).set('pageSize', pageSize),
    });
  }

  // Super Admin — Sellers
  getSellers(status?: string): Observable<SellerSummary[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<SellerSummary[]>(`${this.base}/superadmin/sellers`, { params });
  }

  approveSeller(id: string, approve: boolean, rejectionReason?: string): Observable<void> {
    return this.http.post<void>(`${this.base}/superadmin/sellers/${id}/approve`, {
      approve,
      rejectionReason,
    });
  }

  // Super Admin — Admins
  getAdminStaff(): Observable<AdminStaff[]> {
    return this.http.get<AdminStaff[]>(`${this.base}/superadmin/admins`);
  }

  createAdmin(data: { firstName: string; lastName: string; email: string; password: string }): Observable<void> {
    return this.http.post<void>(`${this.base}/superadmin/admins`, data);
  }

  suspendUser(id: string): Observable<void> {
    return this.http.post<void>(`${this.base}/superadmin/users/${id}/suspend`, {});
  }
}
