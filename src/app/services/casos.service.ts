import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Casos } from '../model/Caso';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
  })
export class CasosService {
  
  private readonly url: string = `${environment.HOST}/casos`;

  private readonly http = inject(HttpClient);

  
  private readonly _casos = signal<Casos[]>([]);
  private readonly _message = signal<string>('');


  readonly $casosChange = this._casos.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  findAll(): Observable<Casos[]> {
    return this.http.get<Casos[]>(this.url);
  }

  findById(id: number): Observable<Casos> {
    return this.http.get<Casos>(`${this.url}/${id}`);
  }

  save(caso: Casos): Observable<Casos> {
    return this.http.post<Casos>(this.url, Casos);
  }

  update(id: number, caso: Casos): Observable<Casos> {
    return this.http.put<Casos>(`${this.url}/${id}`, caso);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  
  setCasosChange(data: Casos[]): void {
    this._casos.set(data);
  }

  setMessageChange(msg: string): void {
    this._message.set(msg);
  }
}