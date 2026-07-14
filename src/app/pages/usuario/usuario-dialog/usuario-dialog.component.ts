import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UsuarioService } from '../../../services/usuario.service';
import { RolService } from '../../../services/rol.service';
import { AbogadoService } from '../../../services/abogado.service';
import { switchMap, tap } from 'rxjs';
import { Usuario } from '../../../model/usuario';
import { Rol } from '../../../model/rol';
import { Abogado } from '../../../model/abogado';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AbogadoDialogComponent } from '../../abogado/abogado-dialog/abogado-dialog.component';

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './usuario-dialog.component.html',
  styleUrl: './usuario-dialog.component.css',
})
export class UsuarioDialogComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly usuarioService = inject(UsuarioService);
  private readonly rolService = inject(RolService);
  private readonly abogadoService = inject(AbogadoService);
  private readonly dialog = inject(MatDialog);
  protected readonly data: Usuario = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<UsuarioDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected roles: Rol[] = [];
  protected abogados: Abogado[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && this.data.idUsuario > 0;

    this.rolService.findAll().subscribe(data => {
      this.roles = data;
      this.cdr.detectChanges();
    });

    this.abogadoService.findAll().subscribe(list => {
      this.abogados = list;
      this.cdr.detectChanges();
    });

    this.form = new FormGroup({
      idUsuario: new FormControl(this.data?.idUsuario ?? null),
      username: new FormControl(this.data?.username ?? '', [Validators.required]),
      idRol: new FormControl(this.data?.idRol ?? '', [Validators.required]),
      idAbogado: new FormControl(this.data?.idAbogado ?? null),
      password: new FormControl(this.data?.password ?? '', this.edicion ? [] : [Validators.required])
    });
  }

operate(){
    if (this.form.invalid) return;

    const formValue = this.form.value;

    // Detectamos si el abogado asignado sigue siendo el mismo para evitar el bug transaccional del backend
    const esMismoAbogado = this.edicion && this.data?.idAbogado === Number(formValue.idAbogado);

    // Construimos el Payload limpio mapeable al DTO
    const usuarioPayload: any = {
      idUsuario: formValue.idUsuario,
      username: formValue.username,
      
      // Si el input está vacío, enviamos string vacío para que el backend no altere la contraseña actual
      password: formValue.password ? formValue.password : '', 
      idRol: formValue.idRol ? Number(formValue.idRol) : null,
      
      // === VÁLVULA DE ESCAPE PARA EL ERROR 500 ===
      // Si es el mismo abogado, mandamos null para saltar la lógica redundante de asignación del backend
      idAbogado: esMismoAbogado ? null : (formValue.idAbogado ? Number(formValue.idAbogado) : null)
    };

    console.log("Payload enviado para actualización:", usuarioPayload);

    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.usuarioService.update(usuarioPayload.idUsuario, usuarioPayload)
      : this.usuarioService.save(usuarioPayload);

    operation$.pipe(
      switchMap(() => this.usuarioService.findAll()),
      tap(data => this.usuarioService.setListChange(data)),
      tap(() => this.usuarioService.setMessageChange(msg))
    )
    .subscribe({
      next: () => this.close(),
      error: (err) => {
        console.error("Error al persistir el usuario:", err);
        // Tip: Si sigue saliendo 500, la alternativa definitiva es poner nullable = true en la entidad Abogado.java
      }
    });
  }

  abrirCrearAbogado(): void {
    const ref = this.dialog.open(AbogadoDialogComponent, {
      width: '550px',
    });
    ref.afterClosed().subscribe(() => {
      this.abogadoService.findAll().subscribe(data => {
        this.abogados = data;
        this.cdr.detectChanges();
      });
    });
  }

  close(){
    this.dialogRef.close();
  }
}