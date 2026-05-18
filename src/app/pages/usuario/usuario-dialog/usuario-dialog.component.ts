import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsuarioService } from '../../../services/usuario.service';
import { switchMap, tap } from 'rxjs';
import { usuario } from '../../../model/usuario';

@Component({
  selector: 'app-usuario-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './usuario-dialog.component.html',
  styleUrl: './usuario-dialog.component.css',
})
export class UsuarioDialogComponent {
  private readonly usuarioService = inject(UsuarioService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);

  protected $usuario = signal({ ... this.data });
  
  operate(){
    const usuario = this.$usuario();
    const isEdit = usuario != null && usuario.idUsuario > 0;
    const msg = isEdit ? 'UPDATED' : 'CREATED';
    const operation$ = isEdit ? this.usuarioService.update(usuario.idUsuario, usuario) : this.usuarioService.save(usuario); 

    operation$.pipe(
      switchMap(() => this.usuarioService.findAll()),
      tap(data => this.usuarioService.setListChange(data)),
      tap( () => this.usuarioService.setMessageChange(msg))
    )
    .subscribe(() => this.close());
  }

  close(){
    this.dialogRef.close();
  }
}