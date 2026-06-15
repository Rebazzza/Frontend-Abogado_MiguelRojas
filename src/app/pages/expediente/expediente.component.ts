<<<<<<< HEAD
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
=======
import { Component, inject, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExpedienteService } from '../../services/expediente.service';
import { expedienteVistaResumen } from '../../model/expediente';
import { switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expediente',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './expediente.component.html',
  styleUrl: './expediente.component.css'
})
export class ExpedienteComponent {
  private readonly expedienteService = inject(ExpedienteService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  protected $expedientes = signal<expedienteVistaResumen[]>([]);
  protected $filterValue = signal<string>('');

  constructor() {
    this.loadExpedientes();
    this.initializeEffects();
  }

  private loadExpedientes(): void {
    this.expedienteService.findAll().subscribe({
      next: (data: any) => this.expedienteService.setExpedienteChange(data),
      error: (err) => console.error('Error al cargar expedientes', err)
    });
  }

  private initializeEffects(): void {
    effect(() => {
      const data = this.expedienteService.$expedienteChange();
      this.$expedientes.set(data);
    });

    effect(() => {
      const message = this.expedienteService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        untracked(() => this.expedienteService.setMessageChange(''));
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.$filterValue.set(filterValue.toLowerCase());
  }

  getFilteredExpedientes(): expedienteVistaResumen[] {
    const expedientes = this.$expedientes();
    const filterValue = this.$filterValue();

    return expedientes.filter(exp => {
      const matchesFilter = filterValue === '' ||
        exp.titulo.toLowerCase().includes(filterValue) ||
        exp.victima.toLowerCase().includes(filterValue) ||
        exp.victimario.toLowerCase().includes(filterValue) ||
        exp.resumenExpediente.toLowerCase().includes(filterValue);

      return matchesFilter;
    });
  }

  verDetalles(idExPediente: number): void {
    this.router.navigate(['/expediente', idExPediente]);
  }

  delete(idExPediente: number): void {
    const ok = window.confirm('¿Estás seguro de que deseas eliminar este expediente?');
    if (ok) {
      this.expedienteService.delete(idExPediente)
        .pipe(
          switchMap(() => this.expedienteService.findAll()),
          tap(data => this.expedienteService.setExpedienteChange(data)),
          tap(() => this.expedienteService.setMessageChange('EXPEDIENTE ELIMINADO'))
        )
        .subscribe();
    }
  }
}
>>>>>>> 5fc849086ae2802b085e234d8859d1d537f605cd

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