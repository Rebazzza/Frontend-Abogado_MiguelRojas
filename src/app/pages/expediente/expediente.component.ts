import { Component, effect, inject, signal, untracked, viewChild, OnInit } from '@angular/core';
  import { expediente } from '../../model/expediente'; // Asegúrate de que la clase empiece con mayúscula o igual a tu modelo
  import { ExpedienteService } from '../../services/expediente.service';
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
  import { MatDialog, MatDialogModule } from '@angular/material/dialog';import { ExpedienteDialogComponent } from './expediente-dialog/expediente-dialog.component';
import { ClienteDialogComponent } from '../cliente/cliente-dialog/cliente-dialog.component';

@Component({
  selector: 'app-expediente',
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
  templateUrl: './expediente.component.html',
  styleUrl: './expediente.component.css',
})

export class ExpedienteComponent implements OnInit { 
  private readonly expedienteService = inject(ExpedienteService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<expediente>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Columnas añadidas y ordenadas igual que el HTML
  protected displayedColumns: string[] = ['idExpediente', 'titulo', 'tipoExpediente', 'resumenExpediente', 'victima', 'victimario', 'fechaInicio', 'fechaCierre', 'estadoExpediente', 'pdfExpediente'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarExpedientes();
  }

  private listarExpedientes(): void {
    this.expedienteService.findAll().subscribe({
      next: (data) => this.expedienteService.setListChange(data),
      error: (err) => console.error('Error al cargar expedientes', err)
    });
  }

  private initializeEffects(){
    effect(() => {
      const data = this.expedienteService.$listChange();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    }); 

    effect(() => {
      const message = this.expedienteService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.expedienteService.setMessageChange(''));
      }
    });
  }

  openDialog(expediente?: expediente){
    const dialogRef = this.dialog.open(ExpedienteDialogComponent, {
      width: '650px',
      data: expediente
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listarExpedientes();
    });
  }

  delete(idExpediente: number){
    const ok = window.confirm('¿Estás seguro de eliminar este expediente?');
    if(ok){
      this.expedienteService.delete(idExpediente).pipe(
        switchMap(() => this.expedienteService.findAll()),
        tap(data => this.expedienteService.setListChange(data)),
        tap(() => this.expedienteService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }
  
  applyFilter(e: Event){ 
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}