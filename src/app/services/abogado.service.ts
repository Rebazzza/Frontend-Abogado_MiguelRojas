import { HttpClient } from '@angular/common/http';
import { inject, Injectable,signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Abogado } from '../model/abogado';

@Injectable({
  providedIn: 'root',
})
export class AbogadoService {
  //private url = 'http://localhost:9090/abogados';
  private url:string = `${environment.HOST}/abogados`;

  //constructor(private http: HttpClient){}
  private readonly http = inject(HttpClient);

  private readonly _abogados = signal<Abogado[]>([]);
  private readonly _message = signal<string>('');

  readonly $categoriesChange = this._abogados.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  // get post put delete
  findAll(){
    return this.http.get<Abogado[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Abogado>(`${this.url}/${id}`);
  }

  save(category: Abogado){
    return this.http.post(this.url, category);
  }

  update(id: number, category: Abogado){
    return this.http.put(`${this.url}/${id}`, category);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  ////set////
  setCategoryChange(data: Abogado[]){
    
    this._abogados.set(data);
  }

  setMessageChange(msg: string){
    this._message.set(msg);
  }
}
