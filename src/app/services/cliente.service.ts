import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Cliente } from '../model/cliente';
import { GenericSignalService } from './generic-signal.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericSignalService<Cliente> {
  protected override url:string = `${environment.HOST}/clientes`;

  readonly abogadoIdFilter = signal<number | null>(null);

  override findAll(): Observable<Cliente[]> {
    const abogadoId = this.abogadoIdFilter();
    if (abogadoId != null) {
      const params = new HttpParams().set('abogadoId', abogadoId);
      return this.http.get<Cliente[]>(this.url, { params });
    }
    return this.http.get<Cliente[]>(this.url);
  }

  listPageable(p:number,s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
}