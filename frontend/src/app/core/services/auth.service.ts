import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthTokens, User } from '../models/user.model';

interface LoginResponse { user: User; tokens: AuthTokens; }
interface RegisterResponse { user: User; tokens: AuthTokens; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.authApiUrl;

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, password });
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.base}/auth/register`, { firstName, lastName, email, password });
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.base}/auth/refresh`, { refreshToken });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, {});
  }
}
