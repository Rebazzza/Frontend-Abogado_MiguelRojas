import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { switchMap, tap } from 'rxjs';


import { CitaService } from '../../../services/cita.service'; 
import { cita as Cita } from '../../../model/cita'; 

@Component({
  selector: 'app-cita-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './cita-dialog.component.html',
  styleUrl: './cita-dialog.component.css'
})
export class CitaDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CitaDialogComponent>);
  // Inyectamos la data (si viene data, es edición; si es null, es creación)
  private readonly data = inject<Cita>(MAT_DIALOG_DATA);
  private readonly citaService = inject(CitaService);

  form: FormGroup;
  isEdit = false;

  constructor() {
    
    this.form = this.fb.group({
      idCita: [null],
      motivo: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      estado: ['Pendiente', Validators.required]
    });
  }

  ngOnInit(): void {

    if (this.data) {
      this.isEdit = true;
      this.form.patchValue(this.data);
    }
  }

  save(): void {
    if (this.form.invalid) return;

    const citaData: Cita = this.form.value;

    if (this.isEdit) {
      // Flujo de Actualización
      this.citaService.update(citaData.idCita, citaData).pipe(
        switchMap(() => this.citaService.findAll()),
        tap(data => this.citaService.setListChange(data)),
        tap(() => this.citaService.setMessageChange('Cita actualizada correctamente'))
      ).subscribe(() => this.dialogRef.close());
    } else {
      // Flujo de Inserción
      this.citaService.save(citaData).pipe(
        switchMap(() => this.citaService.findAll()),
        tap((data: Cita[]) => this.citaService.setListChange(data)),
        tap(() => this.citaService.setMessageChange('Cita registrada correctamente'))
      ).subscribe(() => this.dialogRef.close());
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}