import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'banners',
    loadComponent: () =>
      import('./banner-list.component').then((m) => m.BannerListComponent),
  },
  {
    path: 'coupons',
    loadComponent: () =>
      import('./coupon-list.component').then((m) => m.CouponListComponent),
  },
];
