import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Especialista } from '../../../model/especialista';
import { EspecialistaService } from '../../../services/especialista.service';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-especialista-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './especialista-dialog.component.html',
})
export class EspecialistaDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<EspecialistaDialogComponent>);
  protected readonly dataInjected: Especialista = inject(MAT_DIALOG_DATA);
  private readonly especialistaService = inject(EspecialistaService);

  protected form!: FormGroup;
  protected edicion: boolean = false;

  ngOnInit(): void {
    this.edicion = this.dataInjected != null && (this.dataInjected.idEspecialista ?? 0) > 0;

    this.form = new FormGroup({
      idEspecialista: new FormControl(this.dataInjected?.idEspecialista ?? null),
      nombre: new FormControl(this.dataInjected?.nombre ?? '', [Validators.required, Validators.maxLength(100)]),
      descripcion: new FormControl(this.dataInjected?.descripcion ?? '', [Validators.required, Validators.maxLength(500)]),
      dni: new FormControl(this.dataInjected?.dni ?? '', [Validators.required, Validators.minLength(8)]),
      estado: new FormControl(this.dataInjected?.estado ?? 'ACTIVO', [Validators.required]),
      disponibilidad: new FormControl(this.dataInjected?.disponibilidad ?? true),
      telefono: new FormControl(this.dataInjected?.telefono ?? '', [Validators.required]),
      correo: new FormControl(this.dataInjected?.correo ?? '', [Validators.required, Validators.email])
    });
  }

  operate(): void {
    if (this.form.invalid) return;

    const especialistaValue: Especialista = this.form.value;

    if (this.edicion) {
      // Flujo UPDATE: Modifica, refresca la señal global del servicio y avisa al componente principal
      this.especialistaService.update(especialistaValue.idEspecialista!, especialistaValue).pipe(
        switchMap(() => this.especialistaService.findAll()),
        tap(newData => this.especialistaService.setListChange(newData)),
        tap(() => this.especialistaService.setMessageChange('MODIFICADO CORRECTAMENTE'))
      ).subscribe(() => this.dialogRef.close());
    } else {
      // Flujo SAVE: Guarda nuevo, refresca la señal global y cierra
      this.especialistaService.save(especialistaValue).pipe(
        switchMap(() => this.especialistaService.findAll()),
        tap(newData => this.especialistaService.setListChange(newData)),
        tap(() => this.especialistaService.setMessageChange('REGISTRADO CORRECTAMENTE'))
      ).subscribe(() => this.dialogRef.close());
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}