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
  protected override url:string = `${environment.HOST}/usuarios`;
}