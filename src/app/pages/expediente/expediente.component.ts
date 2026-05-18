import { Component, inject, viewChild, signal, effect, untracked } from '@angular/core';
import { ExpedienteService } from '../../services/expediente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { expediente, expedienteVistaResumen } from '../../model/expediente';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-expediente',
  imports: [],
  templateUrl: './expediente.component.html',
  styleUrl: './expediente.component.css',
})
export class ExpedienteComponent {
  private readonly expedienteService = inject(ExpedienteService);
  
  //creador de alertas
  private readonly snackBar = inject(MatSnackBar);

  protected $expediente = signal<expedienteVistaResumen[]>([]);

  constructor(){
    this.expedienteService.findAll().subscribe(data => this.expedienteService.setExpedienteChange(data));
    effect(() =>{
      const data = this.expedienteService.$expedienteChange();
      this.$expediente.set(data);
    });
    effect(() =>{
      const message = this.expedienteService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'top'});
        untracked(() => this.expedienteService.setMessageChange(''));
      }
    });
  }

  delete(idExPediente: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.expedienteService.delete(idExPediente).pipe(switchMap(() => this.expedienteService.findAll()), tap(data => this.expedienteService.setExpedienteChange(data)), tap(() => this.expedienteService.setMessageChange('DELETED'))).subscribe();
    }
  }
}

