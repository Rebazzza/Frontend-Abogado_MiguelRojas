import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsuarioService } from '../../../services/usuario.service';
import { switchMap, tap } from 'rxjs';
import { usuario } from '../../../model/usuario';

// 🌟 IMPORTANTE: Cambiamos 'FormsModule' por los módulos reactivos
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario-dialog',
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule // 🌟 Reemplazado aquí
  ],
  templateUrl: './usuario-dialog.component.html',
  styleUrl: './usuario-dialog.component.css',
})
export class UsuarioDialogComponent implements OnInit { // 🌟 Implementa OnInit para inicializar el formulario
  private readonly usuarioService = inject(UsuarioService);
  protected readonly data: usuario = inject(MAT_DIALOG_DATA); // Tipamos la data recibida
  private readonly dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);

  // 🌟 Declaración de propiedades requeridas por el HTML
  protected form!: FormGroup;
  protected edicion: boolean = false;

  ngOnInit(): void {
    // 1. Detectamos si es edición si nos pasaron un objeto con ID válido
    this.edicion = this.data != null && this.data.idUsuario > 0;

    // 2. Construimos el esqueleto del Formulario Reactivo con sus validaciones
    this.form = new FormGroup({
      idUsuario: new FormControl(this.data?.idUsuario ?? null),
      nombre: new FormControl(this.data?.username  ?? '', [Validators.required]),
      rol: new FormControl(this.data.idRol ?? '', [Validators.required]),
      // La contraseña es obligatoria solo si estamos creando un nuevo usuario
      password: new FormControl(this.data?.password ?? '', this.edicion ? [] : [Validators.required])
    });
  }
  
  operate(){
    if (this.form.invalid) return; // Validación de seguridad antes de proceder

    // EXTRAEMOS los valores limpios directamente del formulario reactivo
    const usuarioFormValue: usuario = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';
    
    const operation$ = this.edicion 
      ? this.usuarioService.update(usuarioFormValue.idUsuario, usuarioFormValue) 
      : this.usuarioService.save(usuarioFormValue); 

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