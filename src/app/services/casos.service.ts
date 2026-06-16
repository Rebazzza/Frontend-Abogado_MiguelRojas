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
}