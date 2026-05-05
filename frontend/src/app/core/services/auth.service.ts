import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthTokens, User } from '../models/user.model';

interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface ApiAuthResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  user: ApiUser;
}

interface ApiRefreshResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
}

interface AuthResult { user: User; tokens: AuthTokens; }

// ClaimTypes.Role serialized in a .NET JWT
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.authApiUrl;

  private decodeRoles(accessToken: string): string[] {
    try {
      const payload = accessToken.split('.')[1];
      if (!payload) return [];
      const padded = payload.replaceAll('-', '+').replaceAll('_', '/');
      const json = JSON.parse(atob(padded)) as Record<string, unknown>;
      const raw = json[ROLE_CLAIM];
      if (raw === null || raw === undefined) return [];
      return Array.isArray(raw) ? (raw as string[]) : [raw as string];
    } catch {
      return [];
    }
  }

  private buildUser(apiUser: ApiUser, accessToken: string): User {
    return {
      id:          apiUser.id,
      email:       apiUser.email,
      firstName:   apiUser.firstName,
      lastName:    apiUser.lastName,
      phoneNumber: null,
      roles:       this.decodeRoles(accessToken),
    };
  }

  private toAuthResult(res: ApiAuthResponse): AuthResult {
    return {
      user:   this.buildUser(res.user, res.accessToken),
      tokens: {
        accessToken:  res.accessToken,
        refreshToken: res.refreshToken,
        expiresIn:    0,
      },
    };
  }

  login(email: string, password: string): Observable<AuthResult> {
    return this.http
      .post<ApiAuthResponse>(`${this.base}/auth/login`, { email, password })
      .pipe(map((res) => this.toAuthResult(res)));
  }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Observable<AuthResult> {
    return this.http
      .post<ApiAuthResponse>(`${this.base}/auth/register`, {
        firstName, lastName, email, password, confirmPassword: password,
      })
      .pipe(map((res) => this.toAuthResult(res)));
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.http
      .post<ApiRefreshResponse>(`${this.base}/auth/refresh`, { refreshToken })
      .pipe(
        map((res) => ({
          accessToken:  res.accessToken,
          refreshToken: res.refreshToken,
          expiresIn:    0,
        })),
      );
  }

  logout(refreshToken: string): Observable<void> {
    return this.http.post<void>(`${this.base}/auth/logout`, { refreshToken });
  }
}
