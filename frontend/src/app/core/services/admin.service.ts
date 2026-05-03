import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type BannerPlacement = 'HeroCarousel' | 'CategoryStrip' | 'PromoBanner' | 'FlashSale';
export type DiscountType    = 'Percentage' | 'FlatAmount';

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  placement: BannerPlacement;
  displayOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export interface CreateBannerRequest {
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  placement: BannerPlacement;
  displayOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountCap: number | null;
  usageLimitPerUser: number | null;
  totalUsageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
}

export interface CreateCouponRequest {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountCap: number | null;
  usageLimitPerUser: number | null;
  totalUsageLimit: number | null;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.adminApiUrl;

  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.base}/admin/banners`);
  }

  createBanner(req: CreateBannerRequest): Observable<Banner> {
    return this.http.post<Banner>(`${this.base}/admin/banners`, req);
  }

  deleteBanner(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/banners/${id}`);
  }

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.base}/admin/coupons`);
  }

  createCoupon(req: CreateCouponRequest): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.base}/admin/coupons`, req);
  }

  deleteCoupon(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/coupons/${id}`);
  }
}
