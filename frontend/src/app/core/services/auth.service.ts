import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthTokens, User } from '../models/user.model';

interface LoginResponse { user: User; tokens: AuthTokens; }
interface RegisterResponse { user: User; tokens: AuthTokens; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.authApiUrl;

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<any>(`${this.base}/auth/login`, { email, password }).pipe(
      map(res => ({
        user: res.user,
        tokens: {
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          expiresIn: 0
        }
      }))
    );
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<any>(`${this.base}/auth/register`, { firstName, lastName, email, password, confirmPassword: password }).pipe(
      map(res => ({
        user: res.user,
        tokens: {
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          expiresIn: 0
        }
      }))
    );
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.http.post<any>(`${this.base}/auth/refresh`, { refreshToken }).pipe(
      map(res => ({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expiresIn: 0
      }))
    );
  }

  logout(refreshToken: string): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, { refreshToken });
  }
}
