import { Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
import { EspecialistaService } from '../../services/especialista.service';
import { Especialista } from '../../model/especialista';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EspecialistaDialogComponent } from './especialista-dialog/especialista-dialog.component';


@Component({
  selector: 'app-especialista',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatIconModule,
    RouterOutlet
],
  templateUrl: './especialista.component.html',
  styleUrl: './especialista.component.css',
})
export class EspecialistaComponent implements OnInit {
  private readonly especialistaService = inject(EspecialistaService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog); 

  protected $dataSource = signal(new MatTableDataSource<Especialista>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected displayedColumns: string[] = ['idEspecialista', 'nombre', 'descripcion', 'estado', 'dni', 'disponibilidad','telefono','correo','acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarEspecialistas();
  }

  private listarEspecialistas(): void {
    this.especialistaService.findAll().subscribe({
      next: (data) => this.especialistaService.setListChange(data),
      error: (err) => console.error('Error al cargar especialistas', err)
    });
  }

  private initializeEffects() {
    effect(() => {
      const data = this.especialistaService.$listChange(); // Usando tu servicio genérico
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    });

    effect(() => {
      const message = this.especialistaService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.especialistaService.setMessageChange(''));
      }
    });
  }

  
  openDialog(especialista?: Especialista): void {
    const dialogRef = this.dialog.open(EspecialistaDialogComponent, {
      width: '650px',
      data: especialista 
    });

    
    dialogRef.afterClosed().subscribe(() => {
      this.listarEspecialistas();
    });
  }

  delete(idEspecialista: number): void {
    const ok = window.confirm('¿Seguro que deseas eliminar este especialista?');
    if (ok) {
      this.especialistaService.delete(idEspecialista).pipe(
        switchMap(() => this.especialistaService.findAll()),
        tap(data => this.especialistaService.setListChange(data)),
        tap(() => this.especialistaService.setMessageChange('ELIMINADO'))
      ).subscribe();
    }
  }

  applyFilter(e: Event): void {
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}