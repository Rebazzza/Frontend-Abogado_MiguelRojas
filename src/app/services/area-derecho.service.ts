import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AreaDerecho } from '../model/area_derecho';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class AreaDerechoService extends GenericSignalService<AreaDerecho> {
  protected override url: string = `${environment.HOST}/areas`;
  listPageable(p:number,s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}