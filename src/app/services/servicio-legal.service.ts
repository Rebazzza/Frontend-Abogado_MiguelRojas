import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ServicioLegal } from '../model/servicio_legal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicioLegalService { 

  private readonly url: string = `${environment.HOST}/servicios_legales`;

  private readonly http = inject(HttpClient);

  private readonly _servicioLegal = signal<ServicioLegal[]>([]);
  private readonly _message = signal<string>('');

  readonly $servicioLegalChange = this._servicioLegal.asReadonly(); // CORREGIDO: Nombre semántico
  readonly $messageChange = this._message.asReadonly();

  findAll(): Observable<ServicioLegal[]> {
    return this.http.get<ServicioLegal[]>(this.url);
  }

  findById(id: number): Observable<ServicioLegal> {
    return this.http.get<ServicioLegal>(`${this.url}/${id}`);
  }

  save(servicioLegal: ServicioLegal): Observable<ServicioLegal> { // CORREGIDO: Tipado estricto
    return this.http.post<ServicioLegal>(this.url, servicioLegal);
  }

  update(id: number, servicioLegal: ServicioLegal): Observable<ServicioLegal> { // CORREGIDO: Ruta corregida de ${estado} a ${id}
    return this.http.put<ServicioLegal>(`${this.url}/${id}`, servicioLegal);
  }

  delete(id: number): Observable<void> { 
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  setServicioLegalChange(data: ServicioLegal[]): void { 
    this._servicioLegal.set(data);
  }

  setMessageChange(msg: string): void {
    this._message.set(msg);
  }
}