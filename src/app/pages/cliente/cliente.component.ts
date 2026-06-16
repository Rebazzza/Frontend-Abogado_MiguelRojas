import { Component, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';


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
import { Cliente } from '../../model/cliente';
import { ClienteDialogComponent } from './cliente-dialog/cliente-dialog.component';

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
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export class ClienteComponent implements OnInit { 
  private readonly clienteService = inject(ClienteService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  

  protected $dataSource = signal(new MatTableDataSource<Cliente>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  // Columnas añadidas y ordenadas igual que el HTML
  protected displayedColumns: string[] = ['idCliente', 'nombre', 'descripcion', 'dni', 'RUC', 'telefono', 'dirección', 'correo','estado','Tipo','Acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarAbogados();
  }

  private listarAbogados(): void {
    this.clienteService.findAll().subscribe({
      next: (data) => this.clienteService.setListChange(data),
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  private initializeEffects(){
    effect(() => {
      const data = this.clienteService.$listChange();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    }); 

    effect(() => {
      const message = this.clienteService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.clienteService.setMessageChange(''));
      }
    });
  }

  openDialog(cliente?: Cliente){
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '650px',
      data: cliente
    });

    dialogRef.afterClosed().subscribe(() => {
      this.listarAbogados();
    });
  }

  delete(idCliente: number){
    const ok = window.confirm('¿Estás seguro de eliminar este abogado?');
    if(ok){
      this.clienteService.delete(idCliente).pipe(
        switchMap(() => this.clienteService.findAll()),
        tap(data => this.clienteService.setListChange(data)),
        tap(() => this.clienteService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }
  
  applyFilter(e: Event){ 
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }
}
