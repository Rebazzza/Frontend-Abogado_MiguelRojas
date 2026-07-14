import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {expediente} from '../model/expediente'
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class ExpedienteService extends GenericSignalService<expediente> {
  protected override url: string = `${environment.HOST}/expedientes`;
  listPageable(p:number,s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}
