import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Especialista } from '../model/especialista';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  private readonly http = inject(HttpClient);
  
  // Modifica esta URL según tu entorno/backend
  private readonly apiUrl = 'http://localhost:8080/especialistas'; 

  // Signals para manejar el estado global de este módulo
  readonly $especialistaChange = signal<Especialista[]>([]);
  readonly $messageChange = signal<string>('');

  // Métodos CRUD HTTP puros
  findAll(): Observable<Especialista[]> {
    return this.http.get<Especialista[]>(this.apiUrl);
  }

  findById(id: number): Observable<Especialista> {
    return this.http.get<Especialista>(`${this.apiUrl}/${id}`);
  }

  save(especialista: Especialista): Observable<Especialista> {
    return this.http.post<Especialista>(this.apiUrl, especialista);
  }

  update(id: number, especialista: Especialista): Observable<Especialista> {
    return this.http.put<Especialista>(`${this.apiUrl}/${id}`, especialista);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos auxiliares para mutar (cambiar) el valor de las señales
  setEspecialistaChange(data: Especialista[]): void {
    this.$especialistaChange.set(data);
  }

  setMessageChange(message: string): void {
    this.$messageChange.set(message);
  }
}