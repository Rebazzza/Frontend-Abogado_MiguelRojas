import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { UsuarioDialogComponent } from '../../usuario/usuario-dialog/usuario-dialog.component';

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
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './abogado-dialog.component.html'
})
export class AbogadoDialogComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly abogadoService = inject(AbogadoService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
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
      telefono: new FormControl(this.data?.telefono ?? '', [Validators.required, Validators.pattern(/^9\d{8}$/)]),
      especialidad: new FormControl(this.data?.especialidad ?? '', [Validators.required]),
      dni: new FormControl(this.data?.dni ?? '', [Validators.required, Validators.minLength(8)]),
      idUsuario: new FormControl(this.data?.idUsuario ?? null, [Validators.required])
    });
  }
  
operate() {
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
    estado: formValue.estado ?? true,
    idUsuario: formValue.idUsuario
  };

  console.log("Payload enviado a /abogados:", abogadoPayload);

  const msg = this.edicion ? 'UPDATED' : 'CREATED';

  const operation$ = this.edicion
    ? this.abogadoService.update(abogadoPayload.idAbogado!, abogadoPayload)
    : this.abogadoService.save(abogadoPayload);

  operation$.pipe(
    switchMap(() => this.abogadoService.findAll()),
    tap((data) => this.abogadoService.setListChange(data)),
    tap(() => this.abogadoService.setMessageChange(msg))
  ).subscribe({
    next: () => this.close(),
    error: (err) => console.error("El backend volvió a rechazar la petición:", err)
  });
}
  abrirCrearUsuario(): void {
    const ref = this.dialog.open(UsuarioDialogComponent, {
      width: '550px',
    });
    ref.afterClosed().subscribe(() => {
      this.usuarioService.findAll().subscribe(data => {
        this.usuarios = data;
        this.cdr.detectChanges();
      });
    });
  }

  close(){
    this.dialogRef.close();
  }
}