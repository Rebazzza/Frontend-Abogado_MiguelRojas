import { Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { expediente } from '../../model/expediente';


@Component({
  selector: 'app-expediente',
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
  templateUrl: './expediente.component.html',
  styleUrl: './expediente.component.css',
})
export class ExpedienteComponent implements OnInit { 
  private readonly ExpedienteService = inject(ExpedienteService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  

  protected $dataSource = signal(new MatTableDataSource<expediente>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Columnas añadidas y ordenadas igual que el HTML
  protected displayedColumns: string[] = ['idExpediente', 'titulo', 'tipoExpediente', 'resumenExpediente', 'victima', 'victimario', 'fechaInicio', 'fechaCierre','estadoExpediente','pdfExpediente'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarExpedientes();
  }

  private listarExpedientes(): void {
    this.ExpedienteService.findAll().subscribe({
      next: (data) => this.ExpedienteService.setListChange(data),
      error: (err) => console.error('Error al cargar expedientes', err)
    });
  }

  private initializeEffects(){
    effect(() => {
      const data = this.ExpedienteService.$listChange();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    }); 

    effect(() => {
      const message = this.ExpedienteService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.ExpedienteService.setMessageChange(''));
      }
    });
  }

  //openDialog(cliente?: expediente){
    //const dialogRef = this.dialog.open(ClienteDialogComponent, {
      //width: '650px',
      //data: cliente
    //});

    //dialogRef.afterClosed().subscribe(() => {
     // this.listarAbogados();
    //});
  //}

  delete(idExPediente: number){
    const ok = window.confirm('¿Estás seguro de eliminar este abogado?');
    if(ok){
      this.ExpedienteService.delete(idExPediente).pipe(
        switchMap(() => this.ExpedienteService.findAll()),
        tap(data => this.ExpedienteService.setListChange(data)),
        tap(() => this.ExpedienteService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }
  
  applyFilter(e: Event){ 
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}
