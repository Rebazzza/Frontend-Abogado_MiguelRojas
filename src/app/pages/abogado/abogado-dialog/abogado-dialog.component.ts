import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AbogadoService } from '../../../services/abogado.service';
import { UsuarioService } from '../../../services/usuario.service';
import { switchMap, tap } from 'rxjs';
import { Abogado } from '../../../model/abogado';
import { Usuario } from '../../../model/usuario';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-abogado-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './abogado-dialog.component.html'
})
export class AbogadoDialogComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly abogadoService = inject(AbogadoService);
  private readonly usuarioService = inject(UsuarioService);
  protected readonly data: Abogado = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AbogadoDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected usuarios: Usuario[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && this.data.idAbogado > 0;

    this.usuarioService.findAll().subscribe(data => {
      this.usuarios = data;
      this.cdr.detectChanges();
    });

    this.form = new FormGroup({
      idAbogado: new FormControl(this.data?.idAbogado ?? null),
      nombre: new FormControl(this.data?.nombre ?? '', [Validators.required]),
      apellido: new FormControl(this.data?.apellido ?? '', [Validators.required]),
      correo: new FormControl(this.data?.correo ?? '', [Validators.required, Validators.email]),
      telefono: new FormControl(this.data?.telefono ?? '', [Validators.required]),
      especialidad: new FormControl(this.data?.especialidad ?? '', [Validators.required]),
      dni: new FormControl(this.data?.dni ?? '', [Validators.required, Validators.minLength(8)]),
      idUsuario: new FormControl(this.data?.idUsuario ?? null)
    });
  }
  
operate(){
  if (this.form.invalid) return;

  const formValue = this.form.value;

  const abogadoPayload: any = {
    idAbogado: formValue.idAbogado,
    nombre: formValue.nombre,
    apellido: formValue.apellido,
    telefono: formValue.telefono,
    dni: formValue.dni,
    correo: formValue.correo,
    especialidad: formValue.especialidad,
    estado: this.data?.estado ?? true,
    idUsuario: this.data?.idUsuario ?? null
  };

  // Solo por seguridad para depurar, pon este log antes de enviar:
  console.log("Payload enviado al backend:", abogadoPayload);

  const msg = this.edicion ? 'UPDATED' : 'CREATED';
  
  const operation$ = this.edicion 
    ? this.abogadoService.update(abogadoPayload.idAbogado, abogadoPayload) 
    : this.abogadoService.save(abogadoPayload);

  operation$.pipe(
    switchMap(() => this.abogadoService.findAll()),
    tap(data => this.abogadoService.setListChange(data)),
    tap(() => this.abogadoService.setMessageChange(msg))
  )
  .subscribe({
    next: () => this.close(),
    error: (err) => {
      console.error("El backend volvió a rechazar la petición:", err);
    }
  });
}

  close(){
    this.dialogRef.close();
  }
}