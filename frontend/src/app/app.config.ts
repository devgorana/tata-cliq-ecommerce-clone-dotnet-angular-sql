import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth.reducer';
import { cartReducer } from './store/cart/cart.reducer';
import { catalogReducer } from './store/catalog/catalog.reducer';
import { uiReducer } from './store/ui/ui.reducer';
import * as authEffects from './store/auth/auth.effects';
import * as cartEffects from './store/cart/cart.effects';
import * as catalogEffects from './store/catalog/catalog.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideStore({
      auth:    authReducer,
      cart:    cartReducer,
      catalog: catalogReducer,
      ui:      uiReducer,
    }),
    provideEffects(authEffects, cartEffects, catalogEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
