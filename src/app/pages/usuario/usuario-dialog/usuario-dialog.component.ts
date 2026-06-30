import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { switchMap, tap } from 'rxjs';
import { Usuario } from '../../../model/usuario';
import { Rol } from '../../../model/rol';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario-dialog',
  standalone: true, // Asegúrate de mantener el standalone si es necesario
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './usuario-dialog.component.html',
  styleUrl: './usuario-dialog.component.css',
})
export class UsuarioDialogComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);
  protected readonly data: Usuario = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected roles: Rol[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && this.data.idUsuario > 0;

    this.rolService.findAll().subscribe(data => {
      this.roles = data;
      this.cdr.detectChanges();
    });

    this.form = new FormGroup({
      idUsuario: new FormControl(this.data?.idUsuario ?? null),
      username: new FormControl(this.data?.username ?? '', [Validators.required]),
      idRol: new FormControl(this.data?.idRol ?? '', [Validators.required]),
      password: new FormControl(this.data?.password ?? '', this.edicion ? [] : [Validators.required])
    });
  }

  operate(){
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const usuarioPayload: any = {
      idUsuario: formValue.idUsuario,
      username: formValue.username,
      password: formValue.password || this.data?.password,
      idRol: formValue.idRol
    };

    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.usuarioService.update(usuarioPayload.idUsuario, usuarioPayload)
      : this.usuarioService.save(usuarioPayload);

    operation$.pipe(
      switchMap(() => this.usuarioService.findAll()),
      tap(data => this.usuarioService.setListChange(data)),
      tap(() => this.usuarioService.setMessageChange(msg))
    )
    .subscribe(() => this.close());
  }

  close(){
    this.dialogRef.close();
  }
}