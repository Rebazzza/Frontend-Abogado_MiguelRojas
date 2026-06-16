import { Component, effect, inject, signal, untracked, viewChild, OnInit } from '@angular/core';
import { AreaDerecho } from '../../model/area_derecho';
import { AreaDerechoService } from '../../services/area-derecho.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { switchMap, tap } from 'rxjs';
import { AreaDerechoDialogComponent } from './area-derecho-dialog/area-derecho-dialog.component';

@Component({
  selector: 'app-area-derecho',
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
    MatChipsModule,
  ],
  templateUrl: './area-derecho.component.html',
  styleUrl: './area-derecho.component.css',
})
export class AreaDerechoComponent implements OnInit {
  private readonly areaDerechoService = inject(AreaDerechoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<AreaDerecho>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected displayedColumns: string[] = ['idArea', 'nombre', 'descripcion', 'estado', 'acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listar();
  }

  private listar(): void {
    this.areaDerechoService.findAll().subscribe({
      next: (data) => this.areaDerechoService.setListChange(data),
      error: (err) => console.error('Error al cargar áreas de derecho', err),
    });
  }

  private initializeEffects() {
    effect(() => {
      const data = this.areaDerechoService.$listChange();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    });

    effect(() => {
      const message = this.areaDerechoService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.areaDerechoService.setMessageChange(''));
      }
    });
  }

  openDialog(area?: AreaDerecho) {
    const dialogRef = this.dialog.open(AreaDerechoDialogComponent, {
      width: '550px',
      data: area,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listar();
    });
  }

  delete(idArea: number) {
    const ok = window.confirm('¿Estás seguro de eliminar esta área de derecho?');
    if (ok) {
      this.areaDerechoService.delete(idArea).pipe(
        switchMap(() => this.areaDerechoService.findAll()),
        tap((data) => this.areaDerechoService.setListChange(data)),
        tap(() => this.areaDerechoService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }

  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}