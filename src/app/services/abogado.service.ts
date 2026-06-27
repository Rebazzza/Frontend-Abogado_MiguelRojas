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
  
  protected override url:string = `${environment.HOST}/abogados`;
  listPageable(p:number,s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
  

}