import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { usuario } from '../model/usuario';
import { GenericService } from './generic.service';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends GenericSignalService<usuario> {
  //private url = 'http://localhost:9090/exams';
  protected override url:string = `${environment.HOST}/usuarios`;

  //constructor(private http: HttpClient){}
  //private readonly http = inject(HttpClient);

  // get post put delete
  /*findAll(){
    return this.http.get<Exam[]>(this.url);
  }*/
}