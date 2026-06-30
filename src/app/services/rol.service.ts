import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Rol } from '../model/rol';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class RolService extends GenericSignalService<Rol> {
  protected override url: string = `${environment.HOST}/roles`;
  listPageable(p:number,s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}