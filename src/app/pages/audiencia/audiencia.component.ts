import { Component, effect, inject, signal, untracked, viewChild, OnInit } from '@angular/core';
import { Audiencia } from '../../model/audiencia';
import { AudienciaService } from '../../services/audiencia.service';
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
import { switchMap, tap } from 'rxjs';
import { AudienciaDialogComponent } from './audiencia-dialog/audiencia-dialog.component';

@Component({
  selector: 'app-audiencia',
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
  ],
  templateUrl: './audiencia.component.html',
  styleUrl: './audiencia.component.css',
})
export class AudienciaComponent implements OnInit {
  private readonly audienciaService = inject(AudienciaService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<Audiencia>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected displayedColumns: string[] = ['idAudiencia', 'fecha', 'hora', 'tipoAudiencia', 'direccion', 'lugarLink', 'acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listar();
  }

  private listar(): void {
    this.audienciaService.findAll().subscribe({
      next: (data) => this.audienciaService.setListChange(data),
      error: (err) => console.error('Error al cargar audiencias', err),
    });
  }

  private initializeEffects() {
    effect(() => {
      const data = this.audienciaService.$listChange();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    });

    effect(() => {
      const message = this.audienciaService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.audienciaService.setMessageChange(''));
      }
    });
  }

  openDialog(audiencia?: Audiencia) {
    const dialogRef = this.dialog.open(AudienciaDialogComponent, {
      width: '650px',
      data: audiencia,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listar();
    });
  }

  delete(idAudiencia: number) {
    const ok = window.confirm('¿Estás seguro de eliminar esta audiencia?');
    if (ok) {
      this.audienciaService.delete(idAudiencia).pipe(
        switchMap(() => this.audienciaService.findAll()),
        tap((data) => this.audienciaService.setListChange(data)),
        tap(() => this.audienciaService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }

  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}