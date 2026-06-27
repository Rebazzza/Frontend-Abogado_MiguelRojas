import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ServicioLegal } from '../model/servicio_legal';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class ServicioLegalService extends GenericSignalService<ServicioLegal> {
  protected override url: string = `${environment.HOST}/servicios_legales`;
  listPageable(p:number,s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}