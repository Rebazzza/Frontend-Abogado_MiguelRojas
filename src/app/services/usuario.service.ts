import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { usuario } from '../model/usuario';
@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url:string =`${environment.HOST}/usuarios`;

  private readonly http = inject(HttpClient);

  findAll(){
    return this.http.get<usuario[]>(this.url);
  }
}
