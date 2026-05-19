import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Audiencia } from '../model/audiencia';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root',
})
export class AudienciaService extends GenericSignalService<Audiencia> {
  protected override url: string = `${environment.HOST}/audiencias`;
}