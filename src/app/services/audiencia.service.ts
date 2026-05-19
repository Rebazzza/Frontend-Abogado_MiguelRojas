import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Audiencia } from '../model/audiencia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudienciaService {
  // URL base apuntando a audiencias
  private readonly url: string = `${environment.HOST}/audiencias`;

  private readonly http = inject(HttpClient);

  private readonly _audiencia = signal<Audiencia[]>([]);
  private readonly _message = signal<string>('');

  readonly $audienciaChange = this._audiencia.asReadonly(); // CORREGIDO: de $expedienteChange a $audienciaChange
  readonly $messageChange = this._message.asReadonly();

  findAll(): Observable<Audiencia[]> {
    return this.http.get<Audiencia[]>(this.url);
  }

  findById(id: number): Observable<Audiencia> {
    return this.http.get<Audiencia>(`${this.url}/${id}`);
  }

  save(audiencia: Audiencia): Observable<Audiencia> { // CORREGIDO: tipado de parámetro y retorno
    return this.http.post<Audiencia>(this.url, audiencia);
  }

  update(id: number, audiencia: Audiencia): Observable<Audiencia> { // CORREGIDO: URL corregida de ${estado} a ${id}
    return this.http.put<Audiencia>(`${this.url}/${id}`, audiencia);
  }

  delete(id: number): Observable<void> { // CORREGIDO: tipado de retorno
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  setAudienciaChange(data: Audiencia[]): void { // CORREGIDO: nombre semántico coherente
    this._audiencia.set(data);
  }

  setMessageChange(msg: string): void {
    this._message.set(msg);
  }
}