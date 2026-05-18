import { Component, inject, signal, effect, untracked } from '@angular/core';
import { PagoService } from '../../services/pago.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { pago } from '../../model/pago';
import { switchMap, tap } from 'rxjs';
@Component({
  selector: 'app-pago',
  imports: [],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css',
})
export class PagoComponent {
  private readonly pagoService = inject(PagoService);
  
  //creador de alertas
  private readonly snackBar = inject(MatSnackBar);

  protected $expediente = signal<pago[]>([]);

  constructor(){
    this.pagoService.findAll().subscribe(data => this.pagoService.setExpedienteChange(data));
    effect(() =>{
      const data = this.pagoService.$expedienteChange();
      this.$expediente.set(data);
    });
    effect(() =>{
      const message = this.pagoService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'top'});
        untracked(() => this.pagoService.setMessageChange(''));
      }
    });
  }
  delete(idExPediente: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.pagoService.delete(idExPediente).pipe(switchMap(() => this.pagoService.findAll()), tap(data => this.pagoService.setExpedienteChange(data)), tap(() => this.pagoService.setMessageChange('DELETED'))).subscribe();
    }
  }
}
