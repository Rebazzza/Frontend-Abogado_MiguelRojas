import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {expediente} from '../model/expediente'


@Injectable({
  providedIn: 'root',
})

export class ExpedienteService {
  //agregar a la cadena '/expediente'
  private url:string = `${environment.HOST}/expedientes`;

  //inyeccion para hacer GET, POST, PUT, DELETE
  private readonly http = inject(HttpClient);

  //signal => guarda la lista de expedientes, ([]) => empieza vacio
  private readonly _expedientes = signal<expediente[]>([])

  //en etse caso guarda texto
  private readonly _message = signal<string>('')

  //convierte lo de antes en versiones de solo lectura
  readonly $expedienteChange = this._expedientes.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  //------------GET POST PUT DELETE-------------
  //trae(GET) la lista completa de expediente existentes
  findAll(){
    return this.http.get<expediente[]>(this.url);
  }
  

  //GET de un solo ID dentro de los expedientes existentes
  findById(id:number){
    return this.http.get<expediente> (`${this.url}/${id}`)
  }

  //Crea(POST) un nuevo expediente
  save(nuevoExpediente: expediente){
    return this.http.post(this.url, nuevoExpediente)
  }

  //edita(UPDATE) un expedeinte exsitente, pero tiene que saber el id
  update(id: number, estado: expediente){
    return this.http.put(`${this.url}/${estado}`, estado);
  }

  //elimina(DELETE) un expediente existente
  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  //--------------SET---------------
  //Actualiza la lista interna de los expedientes y lo avisa a los componentes
  setExpedienteChange(data: expediente[]){
    this._expedientes.set(data);
  }

  //Actualiza el mensaje de exito/error 
  setMessageChange(msg: string){
    this._message.set(msg);
  }
}
