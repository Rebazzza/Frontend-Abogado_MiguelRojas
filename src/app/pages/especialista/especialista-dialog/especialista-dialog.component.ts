import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
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
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './especialista-dialog.component.html',
})
export class EspecialistaDialogComponent implements OnInit {
  // Inyecciones necesarias de Angular Material Dialog
  private readonly dialogRef = inject(MatDialogRef<EspecialistaDialogComponent>);
  protected readonly dataInjected: Especialista = inject(MAT_DIALOG_DATA); // Datos recibidos de la tabla
  
  private readonly especialistaService = inject(EspecialistaService);

  // Formulario Reactivo basado en tu entidad de Java
  protected form!: FormGroup;
  protected edicion: boolean = false;

  ngOnInit(): void {
    // Definimos los controles del formulario según el modelo de Especialista (nullable = false)
    this.form = new FormGroup({
      idEspecialista: new FormControl(null),
      nombre: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      descripcion: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      estado: new FormControl('', [Validators.required]),
      disponibilidad: new FormControl(true),
      telefono: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email])
    });

    // Si viene dataInjected significa que hacemos click en "EDITAR"
    if (this.dataInjected && this.dataInjected.idEspecialista) {
      this.edicion = true;
      this.form.setValue(this.dataInjected); // Rellena el formulario automáticamente
    }
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