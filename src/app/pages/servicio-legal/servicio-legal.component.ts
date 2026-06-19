import { Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ServicioLegalService } from '../../services/servicio-legal.service';
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
import { ServicioLegal } from '../../model/servicio_legal';
import { ServicioLegalDialogComponent } from './servicio-legal-dialog/servicio-legal-dialog.component';

@Component({
  selector: 'app-servicio-legal',
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
    MatDialogModule,
    CurrencyPipe
  ],
  templateUrl: './servicio-legal.component.html',
  styleUrl: './servicio-legal.component.css',
})
export class ServicioLegalComponent implements OnInit {
  private readonly servicioLegalService = inject(ServicioLegalService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<ServicioLegal>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected displayedColumns: string[] = ['idServicio', 'nombre', 'descripcion', 'costoBase', 'estado', 'acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarServicios();
  }

  private listarServicios(): void {
    this.servicioLegalService.findAll().subscribe({
      next: (data) => this.servicioLegalService.setListChange(data),
      error: (err) => console.error('Error al cargar servicios legales', err)
    });
  }

  private initializeEffects() {
    effect(() => {
      const data = this.servicioLegalService.$listChange();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    });

    effect(() => {
      const message = this.servicioLegalService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.servicioLegalService.setMessageChange(''));
      }
    });
  }

  openDialog(servicioLegal?: ServicioLegal) {
    const dialogRef = this.dialog.open(ServicioLegalDialogComponent, {
      width: '650px',
      data: servicioLegal
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listarServicios();
    });
  }

  delete(idServicio: number) {
    const ok = window.confirm('¿Estás seguro de eliminar este servicio legal?');
    if (ok) {
      this.servicioLegalService.delete(idServicio).pipe(
        switchMap(() => this.servicioLegalService.findAll()),
        tap(data => this.servicioLegalService.setListChange(data)),
        tap(() => this.servicioLegalService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }

  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}
