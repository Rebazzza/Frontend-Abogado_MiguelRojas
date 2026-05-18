import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {pago, pagoPendiente} from '../model/pago';

@Injectable({
  providedIn: 'root',
})

export class PagoService {
  //agregar a la cadena '/expediente'
  private url:string = `${environment.HOST}/pagos`;

  //inyeccion para hacer GET, POST, PUT, DELETE
  private readonly http = inject(HttpClient);

  //signal => guarda la lista de pagos, ([]) => empieza vacio
  private readonly _expedientes = signal<pago[]>([])
  
  //en este caso guarda texto
  private readonly _message = signal<string>('')

  //convierte lo de antes en versiones de solo lectura
  readonly $expedienteChange = this._expedientes.asReadonly();
  readonly $messageChange = this._message.asReadonly();
  
  //------------GET POST PUT DELETE-------------
  //trae(GET) la lista completa de expediente existentes
  findAll(){
    return this.http.get<pago[]>(this.url);
  }

  //GET de un solo ID dentro de los expedientes existentes
  findById(id:number){
    return this.http.get<pago> (`${this.url}/${id}`)
  }

  //Crea(POST) un nuevo expediente
  save(nuevoPago: pago){
    return this.http.post(this.url, nuevoPago)
  }

  //edita(UPDATE) un expedeinte exsitente, pero tiene que saber el id
  update(id: number, estado: pago){
    return this.http.put(`${this.url}/${estado}`, estado);
  }

  //elimina(DELETE) un expediente existente
  delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
  }

  //--------------SET---------------
  //Actualiza la lista interna de los expedientes y lo avisa a los componentes
  setExpedienteChange(data: pago[]){
    this._expedientes.set(data);
  }

  //Actualiza el mensaje de exito/error 
  setMessageChange(msg: string){
    this._message.set(msg);
  }  
}
