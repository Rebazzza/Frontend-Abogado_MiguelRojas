import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Cliente } from '../model/cliente';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericSignalService<Cliente> {
  //private url = 'http://localhost:9090/categories';
  protected override url:string = `${environment.HOST}/clientes`;
}