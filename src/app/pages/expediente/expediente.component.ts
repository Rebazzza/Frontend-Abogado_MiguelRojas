import { Component, inject, signal, effect, untracked } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

import { ExpedienteService } from '../../services/expediente.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { expediente, expedienteVistaResumen } from '../../model/expediente';
import { switchMap, tap } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-expediente',
  imports: [
RouterOutlet,
    RouterLink,
    MatFormFieldModule, // <--- Obligatorio para <mat-form-field> y <mat-label>
    MatInputModule,     // <--- Obligatorio para la directiva matInput
    MatIconModule,      // <--- Obligatorio para <mat-icon>
    MatButtonModule
  ],
  templateUrl: './expediente.component.html',
  styleUrl: './expediente.component.css',
})
export class ExpedienteComponent {
  private readonly expedienteService = inject(ExpedienteService);
  
  //creador de alertas
  private readonly snackBar = inject(MatSnackBar);

  private _allExpedientes: expediente[] = [];
  protected $expediente = signal<any[]>([]);

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
  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value.trim().toLowerCase();

    if (filterValue === '') {
      // Si limpias el buscador, regresa todos los abogados originales
      this.$expediente.set(this._allExpedientes);
    } else {
      // Filtramos por nombre, apellido o especialidad en base al respaldo
      const filtered = this._allExpedientes.filter(expediente => 
        expediente.titulo.toLowerCase().includes(filterValue) || 
        expediente.tipoExpediente.toLowerCase().includes(filterValue) ||
        expediente.resumenExpediente.toLowerCase().includes(filterValue) ||
        expediente.victima.toLowerCase().includes(filterValue) ||
        expediente.victimario.toLowerCase().includes(filterValue) ||
        expediente.fechaInicio.toLowerCase().includes(filterValue) ||
        expediente.fechaCierre.toLowerCase().includes(filterValue)
      );
      this.$expediente.set(filtered); // Guardamos el resultado en la Signal
    }
  }

  delete(idExPediente: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.expedienteService.delete(idExPediente).pipe(switchMap(() => this.expedienteService.findAll()), tap(data => this.expedienteService.setExpedienteChange(data)), tap(() => this.expedienteService.setMessageChange('DELETED'))).subscribe();
    }
  }
}

