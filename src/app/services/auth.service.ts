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

  readonly $loggedIn = this._loggedIn.asReadonly();

  constructor() {
    const stored = localStorage.getItem('loggedIn');
    this._loggedIn.set(stored === 'true');
  }

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<boolean>(`${environment.HOST}/login`, { username, password }).pipe(
      tap((response) => {
        if (response) {
          this._loggedIn.set(true);
          localStorage.setItem('loggedIn', 'true');
        }
      })
    );
  }

  logout(): void {
    this._loggedIn.set(false);
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }
}
