import { Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
import { CasoService } from '../../services/casos.service';


import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Casos } from '../../model/Caso';
import { CasosDialogComponent } from './casos-dialog/casos-dialog.component';


@Component({
  selector: 'app-casos',
  standalone: true,
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    RouterOutlet,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './casos.component.html',
  styleUrl: './casos.component.css',
})
export class CasosComponent implements OnInit { 
  private readonly CasosService = inject(CasoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  

  protected $dataSource = signal(new MatTableDataSource<Casos>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Columnas añadidas y ordenadas igual que el HTML
  protected displayedColumns: string[] = ['idCaso', 'titulo', 'descripcion', 'estado', 'acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarCasos();
  }

  private listarCasos(): void {
    this.CasosService.findAll().subscribe({
      next: (data) => this.CasosService.setListChange(data),
      error: (err) => console.error('Error al cargar casos', err)
    });
  }

  private initializeEffects(){
    effect(() => {
      const data = this.CasosService.$listChange();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    }); 

    effect(() => {
      const message = this.CasosService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.CasosService.setMessageChange(''));
      }
    });
  }

    openDialog(Casos?: Casos){
    const dialogRef = this.dialog.open(CasosDialogComponent, {
      width: '650px',
      data: Casos
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listarCasos();
    });
  }

  delete(idExPediente: number){
    const ok = window.confirm('¿Estás seguro de eliminar este abogado?');
    if(ok){
      this.CasosService.delete(idExPediente).pipe(
        switchMap(() => this.CasosService.findAll()),
        tap(data => this.CasosService.setListChange(data)),
        tap(() => this.CasosService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }
  
  applyFilter(e: Event){ 
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}
