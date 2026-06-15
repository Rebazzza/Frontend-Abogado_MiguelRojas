import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { cita } from '../model/cita';
import { GenericSignalService } from './generic-signal.service';
@Injectable({
  providedIn: 'root',
})
export class CitaService extends GenericSignalService<cita> {
  protected override url: string = `${environment.HOST}/audiencias`;
}