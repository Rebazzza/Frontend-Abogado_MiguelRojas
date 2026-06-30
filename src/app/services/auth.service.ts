import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly _loggedIn = signal<boolean>(false);
  private readonly _username = signal<string>('');

  readonly $loggedIn = this._loggedIn.asReadonly();
  readonly $username = this._username.asReadonly();

  constructor() {
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    this._loggedIn.set(!!token);
    this._username.set(localStorage.getItem('username') ?? '');
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.HOST}/login`, { username, password }).pipe(
      tap((response) => {
        if (response?.access_token) {
          sessionStorage.setItem(environment.TOKEN_NAME, response.access_token);
          this._loggedIn.set(true);
          this._username.set(username);
          localStorage.setItem('username', username);
        }
      })
    );
  }

  logout(): void {
    this._loggedIn.set(false);
    this._username.set('');
    sessionStorage.removeItem(environment.TOKEN_NAME);
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
