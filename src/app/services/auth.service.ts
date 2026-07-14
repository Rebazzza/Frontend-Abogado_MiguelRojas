import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  access_token: string;
}

export interface JwtPayload {
  sub: string;
  role: string;
  idAbogado?: number;
  test?: string;
  iat: number;
  exp: number;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _loggedIn = signal<boolean>(false);
  private readonly _username = signal<string>('');
  private readonly _idAbogado = signal<number | null>(null);
  private readonly _role = signal<string>('');

  readonly $loggedIn = this._loggedIn.asReadonly();
  readonly $username = this._username.asReadonly();
  readonly $idAbogado = this._idAbogado.asReadonly();
  readonly $role = this._role.asReadonly();

  constructor() {
    this.readToken();
  }

  private readToken(): void {
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    this._loggedIn.set(!!token);
    this._username.set(localStorage.getItem('username') ?? '');
    if (token) {
      const payload = decodeToken(token);
      if (payload) {
        this._idAbogado.set(payload.idAbogado ?? null);
        this._role.set(payload.role ?? '');
      }
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.HOST}/login`, { username, password }).pipe(
      tap((response) => {
        if (response?.access_token) {
          sessionStorage.setItem(environment.TOKEN_NAME, response.access_token);
          this._loggedIn.set(true);
          this._username.set(username);
          localStorage.setItem('username', username);
          const payload = decodeToken(response.access_token);
          if (payload) {
            this._idAbogado.set(payload.idAbogado ?? null);
            this._role.set(payload.role ?? '');
          }
        }
      })
    );
  }

  logout(): void {
    this._loggedIn.set(false);
    this._username.set('');
    this._idAbogado.set(null);
    this._role.set('');
    sessionStorage.removeItem(environment.TOKEN_NAME);
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
