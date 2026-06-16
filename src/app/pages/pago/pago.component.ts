import { Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
import { PagoService } from '../../services/pago.service';


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
import { pago } from '../../model/pago';
import { ClienteDialogComponent } from '../cliente/cliente-dialog/cliente-dialog.component';



@Component({
  selector: 'app-pago',
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
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css',
})
export class PagoComponent implements OnInit { 
  private readonly PagoService = inject(PagoService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  

  protected $dataSource = signal(new MatTableDataSource<pago>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Columnas añadidas y ordenadas igual que el HTML
  protected displayedColumns: string[] = ['idPago', 'monto', 'fechaPago', 'metodoPago', 'estadoPago','acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarPagos();
  }

  private listarPagos(): void {
    this.PagoService.findAll().subscribe({
      next: (data) => this.PagoService.setListChange(data),
      error: (err) => console.error('Error al cargar pagos', err)
    });
  }

  private initializeEffects(){
    effect(() => {
      const data = this.PagoService.$listChange();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    }); 

    effect(() => {
      const message = this.PagoService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.PagoService.setMessageChange(''));
      }
    });
  }

  openDialog(cliente?: pago){
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '650px',
      data: cliente
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listarPagos();
    });
  }

  delete(idPago: number){
    const ok = window.confirm('¿Estás seguro de eliminar este pago?');
    if(ok){
      this.PagoService.delete(idPago).pipe(
        switchMap(() => this.PagoService.findAll()),
        tap(data => this.PagoService.setListChange(data)),
        tap(() => this.PagoService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }
  
  applyFilter(e: Event){ 
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}
