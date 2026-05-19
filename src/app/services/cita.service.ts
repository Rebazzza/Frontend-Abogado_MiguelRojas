import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { cita } from '../model/cita';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  // Agregar a la cadena '/citas'
  private url: string = `${environment.HOST}/citas`;

  // Inyección para hacer GET, POST, PUT, DELETE
  private readonly http = inject(HttpClient);

  // signal => guarda la lista de citas, ([]) => empieza vacío
  private readonly _citas = signal<cita[]>([]);
  
  // En este caso guarda texto
  private readonly _message = signal<string>('');

  // Convierte lo de antes en versiones de solo lectura
  readonly $citaChange = this._citas.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  // -------------- GET POST PUT DELETE --------------

  // Trae (GET) la lista completa de citas existentes
  findAll() {
    return this.http.get<cita[]>(this.url);
  }

  // Trae (GET) una cita por su ID
  findById(id: number) {
    return this.http.get<cita>(`${this.url}/${id}`);
  }

  // Guarda (POST) una nueva cita
  save(cita: cita) {
    return this.http.post(this.url, cita);
  }

  // Actualiza (PUT) una cita existente
  update(id: number, cita: cita) {
    return this.http.put(`${this.url}/${id}`, cita);
  }

  // Elimina (DELETE) una cita por su ID
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // -------------- MÉTODOS PARA ACTUALIZAR SIGNALS --------------

  setCitaChange(data: cita[]) {
    this._citas.set(data);
  }

  setMessageChange(msg: string) {
    this._message.set(msg);
  }
}