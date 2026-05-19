import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AreaDerecho } from '../model/area_derecho';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AreaDerechoService {
  
  private readonly url: string = `${environment.HOST}/areas-derecho`;

  private readonly http = inject(HttpClient);

  private readonly _areaDerecho = signal<AreaDerecho[]>([]);
  private readonly _message = signal<string>('');

  readonly $areaDerechoChange = this._areaDerecho.asReadonly(); // CORREGIDO: Nombre semántico
  readonly $messageChange = this._message.asReadonly();

  findAll(): Observable<AreaDerecho[]> {
    return this.http.get<AreaDerecho[]>(this.url);
  }

  findById(id: number): Observable<AreaDerecho> {
    return this.http.get<AreaDerecho>(`${this.url}/${id}`);
  }

  save(areaDerecho: AreaDerecho): Observable<AreaDerecho> { // CORREGIDO: Tipado estricto
    return this.http.post<AreaDerecho>(this.url, areaDerecho);
  }

  update(id: number, areaDerecho: AreaDerecho): Observable<AreaDerecho> { // CORREGIDO: URL arreglada de ${estado} a ${id}
    return this.http.put<AreaDerecho>(`${this.url}/${id}`, areaDerecho);
  }

  delete(id: number): Observable<void> { // CORREGIDO: Tipado de retorno void
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  setAreaDerechoChange(data: AreaDerecho[]): void { // CORREGIDO: Nombre coherente con el módulo
    this._areaDerecho.set(data);
  }

  setMessageChange(msg: string): void {
    this._message.set(msg);
  }
}