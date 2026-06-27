import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Casos } from '../model/Caso';
import { Observable } from 'rxjs';
import { GenericSignalService } from './generic-signal.service';


@Injectable({
  providedIn: 'root',
})
export class CasoService extends GenericSignalService<Casos> {
  protected override url:string = `${environment.HOST}/casos`;
  listPageable(p:number,s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}