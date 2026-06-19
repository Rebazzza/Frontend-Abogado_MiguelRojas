import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

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
    const stored = localStorage.getItem('loggedIn');
    this._loggedIn.set(stored === 'true');
    this._username.set(localStorage.getItem('username') ?? '');
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<boolean>(`${environment.HOST}/login`, { username, password }).pipe(
      tap((response) => {
        if (response) {
          this._loggedIn.set(true);
          this._username.set(username);
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('username', username);
        }
      })
    );
  }

  logout(): void {
    this._loggedIn.set(false);
    this._username.set('');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
