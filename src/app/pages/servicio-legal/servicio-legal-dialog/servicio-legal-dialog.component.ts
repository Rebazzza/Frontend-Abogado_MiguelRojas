import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ServicioLegalService } from '../../../services/servicio-legal.service';
import { ServicioLegal } from '../../../model/servicio_legal';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-servicio-legal-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './servicio-legal-dialog.component.html',
})
export class ServicioLegalDialogComponent implements OnInit {
  private readonly servicioLegalService = inject(ServicioLegalService);
  protected readonly data: ServicioLegal = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ServicioLegalDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;

  ngOnInit(): void {
    this.edicion = this.data != null && (this.data.idServicio ?? 0) > 0;

    this.form = new FormGroup({
      idServicio: new FormControl(this.data?.idServicio ?? null),
      nombre: new FormControl(this.data?.nombre ?? '', [Validators.required]),
      descripcion: new FormControl(this.data?.descripcion ?? '', [Validators.required]),
      costoBase: new FormControl(this.data?.costoBase ?? '', [Validators.min(0)]),
      estado: new FormControl(this.data?.estado ?? 'ACTIVO'),
    });
  }

  operate() {
    if (this.form.invalid) return;

    const value: ServicioLegal = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.servicioLegalService.update(value.idServicio!, value)
      : this.servicioLegalService.save(value);

    operation$.pipe(
      switchMap(() => this.servicioLegalService.findAll()),
      tap((data) => this.servicioLegalService.setListChange(data)),
      tap(() => this.servicioLegalService.setMessageChange(msg))
    ).subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}
