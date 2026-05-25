import { Component, effect, inject, signal, untracked, viewChild, OnInit } from '@angular/core';
import { usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';

@Component({
  selector: 'app-usuario',
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
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent implements OnInit { 
  private readonly usuarioService = inject(UsuarioService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<usuario>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $usuarios = this.usuarioService.$listChange;
  
  protected displayedColumns: string[] = ['idUsuario', 'nombre', 'rol', 'acciones'];

  constructor() {
    this.initializeEffects();
  }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  private listarUsuarios(): void {
    this.usuarioService.findAll().subscribe({
      next: (data) => this.usuarioService.setListChange(data),
      error: (err) => console.error('Error al cargar usuarios', err)
    });
  }

  private initializeEffects(){
    effect(() => {
      const data = this.$usuarios();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p ?? null;
      ds.sort = s ?? null;
    }); 

    effect(() => {
      const message = this.usuarioService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {
          duration: 2000, 
          horizontalPosition: 'right', 
          verticalPosition: 'top'
        });
        untracked(() => this.usuarioService.setMessageChange(''));
      }
    });
  }

  openDialog(usuario?: usuario){
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '650px',
      data: usuario
    });

    
    dialogRef.afterClosed().subscribe(() => {
      this.listarUsuarios();
    });
  }

  delete(idUsuario: number){
    const ok = window.confirm('Are you sure to delete?');
    if(ok){
      this.usuarioService.delete(idUsuario).pipe(
        switchMap(() => this.usuarioService.findAll()),
        tap(data => this.usuarioService.setListChange(data)),
        tap(() => this.usuarioService.setMessageChange('DELETED'))
      ).subscribe();
    }
  }
  
  applyFilter(e: Event){ 
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
    
    if (this.$dataSource().paginator) {
      this.$dataSource().paginator!.firstPage();
    }
  }
}