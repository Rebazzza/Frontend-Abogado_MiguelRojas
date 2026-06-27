import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Especialista } from '../model/especialista';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class EspecialistaService extends GenericSignalService<Especialista> {
  protected override url: string = `${environment.HOST}/especialistas`;
  listPageable(p:number,s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}