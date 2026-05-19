import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Cliente } from '../model/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // Agregar a la cadena '/clientes'
  private url: string = `${environment.HOST}/clientes`;

  // Inyección para hacer GET, POST, PUT, DELETE
  private readonly http = inject(HttpClient);

  // signal => guarda la lista de clientes, ([]) => empieza vacío
  private readonly _clientes = signal<Cliente[]>([]);
  
  // En este caso guarda texto
  private readonly _message = signal<string>('');

  // Convierte lo de antes en versiones de solo lectura
  readonly $clienteChange = this._clientes.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  // -------------- GET POST PUT DELETE --------------

  // Trae (GET) la lista completa de clientes existentes
  findAll() {
    return this.http.get<Cliente[]>(this.url);
  }

  // Trae (GET) un cliente por su ID
  findById(id: number) {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  // Guarda (POST) un nuevo cliente
  save(cliente: Cliente) {
    return this.http.post(this.url, cliente);
  }

  // Actualiza (PUT) un cliente existente
  update(id: number, cliente: Cliente) {
    return this.http.put(`${this.url}/${id}`, cliente);
  }

  // Elimina (DELETE) un cliente por su ID
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  // -------------- MÉTODOS PARA ACTUALIZAR SIGNALS --------------

  setClienteChange(data: Cliente[]) {
    this._clientes.set(data);
  }

  setMessageChange(msg: string) {
    this._message.set(msg);
  }
}