import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
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
    RouterLink,
    RouterOutlet,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  private readonly usuarioService = inject(UsuarioService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<usuario>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $usuarios = this.usuarioService.$listChange;

  protected displayedColumns: string[] = ['idUsuario', 'nombre', 'rol', 'password'];

  constructor() {
    this.usuarioService.findAll().subscribe(data => this.usuarioService.setListChange(data));

    this.initializeEffects();

  }

  private initializeEffects(){
    effect( () => {
      const data = this.$usuarios();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      
      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    }); 

    effect(() => {
      const message = this.usuarioService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'});
        //esta limpieza no activa el rastreo del effect, no entra a un bucle infinito
        untracked( () => this.usuarioService.setMessageChange('') );
      }
    });
  }

  openDialog(usuario?: usuario){
    this.dialog.open(UsuarioDialogComponent,{
      width: '650px',
      data: usuario,
      // disableClose: true
    });
  }

  delete(idUsuario: number){
      const ok = window.confirm('Are you sure to delete?');
      if(ok){
        this.usuarioService.delete(idUsuario)
        .pipe(
          switchMap( () => this.usuarioService.findAll() ),
          tap( data => this.usuarioService.setListChange(data) ),
          tap( () => this.usuarioService.setMessageChange('DELETED') )
        )
        .subscribe();
      }
    }
  
  applyFilter(e: any){
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

}