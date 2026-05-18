import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Abogado } from '../model/abogado';
import { GenericService } from './generic.service';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class AbogadoService extends GenericSignalService<Abogado> {
  //private url = 'http://localhost:9090/categories';
  protected override url:string = `${environment.HOST}/abogados`;

  //constructor(private http: HttpClient){}
  //private readonly http = inject(HttpClient);

  /*private readonly _categories = signal<Category[]>([]);
  private readonly _message = signal<string>('');

  readonly $categoriesChange = this._categories.asReadonly();
  readonly $messageChange = this._message.asReadonly();*/

  // get post put delete
  /*findAll(){
    return this.http.get<Category[]>(this.url);
  }

  findById(id: number){
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  save(category: Category){
    return this.http.post(this.url, category);
  }

  update(id: number, category: Category){
    return this.http.put(`${this.url}/${id}`, category);
  }

  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }*/

  ////set////
  /*setCategoryChange(data: Category[]){
    
    this._categories.set(data);
  }

  setMessageChange(msg: string){
    this._message.set(msg);
  }*/
}