import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () => import('./features/catalog/plp.component').then((m) => m.PlpComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/catalog/pdp.component').then((m) => m.PdpComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
    canActivate: [authGuard],
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'account',
    loadChildren: () => import('./features/account/account.routes').then((m) => m.accountRoutes),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
