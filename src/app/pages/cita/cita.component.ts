import { Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
import { CitaService } from '../../services/cita.service';


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
import { cita } from '../../model/cita';
import { CitaDialogComponent } from './cita-dialog/cita-dialog.component';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterOutlet,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './cita.component.html',
  styleUrl: './cita.component.css',
})
export class CitaComponent implements OnInit { 
  private readonly citaService = inject(CitaService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  

  protected $dataSource = signal(new MatTableDataSource<cita>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Columnas añadidas y ordenadas igual que el HTML
  protected displayedColumns: string[] = ['idCita', 'nombreCliente', 'abogadoAsignado', 'asuntoLegal', 'detallesAdicionales', 'fechaHora', 'activa','Acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarAbogados();
  }

  private listarAbogados(): void {
    this.citaService.findAll().subscribe({
      next: (data) => this.citaService.setListChange(data),
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  private initializeEffects(){
    effect(() => {
      const data = this.citaService.$listChange();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    }); 

    effect(() => {
      const message = this.citaService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.citaService.setMessageChange(''));
      }
    });
  }

  openDialog(cita?: cita){
    const dialogRef = this.dialog.open(CitaDialogComponent, {
      width: '650px',
      data: cita
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listarAbogados();
    });
  }

  delete(idCita: number){
    const ok = window.confirm('¿Estás seguro de eliminar este abogado?');
    if(ok){
      this.citaService.delete(idCita).pipe(
        switchMap(() => this.citaService.findAll()),
        tap(data => this.citaService.setListChange(data)),
        tap(() => this.citaService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }
  
  applyFilter(e: Event){ 
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}
