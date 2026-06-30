import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AreaDerechoService } from '../../../services/area-derecho.service';
import { AreaDerecho } from '../../../model/area_derecho';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-area-derecho-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './area-derecho-dialog.component.html',
})
export class AreaDerechoDialogComponent implements OnInit {
  private readonly areaDerechoService = inject(AreaDerechoService);
  protected readonly data: AreaDerecho = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AreaDerechoDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;

  ngOnInit(): void {
    this.edicion = this.data != null && this.data.idArea > 0;

    this.form = new FormGroup({
      idArea: new FormControl(this.data?.idArea ?? null),
      nombre: new FormControl(this.data?.nombre ?? '', [Validators.required, Validators.maxLength(100)]),
      descripcion: new FormControl(this.data?.descripcion ?? '', [Validators.required, Validators.maxLength(200)]),
      estado: new FormControl(this.data?.estado ?? true),
    });
  }

  operate() {
    if (this.form.invalid) return;

    const value: AreaDerecho = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.areaDerechoService.update(value.idArea, value)
      : this.areaDerechoService.save(value);

    operation$.pipe(
      switchMap(() => this.areaDerechoService.findAll()),
      tap((data) => this.areaDerechoService.setListChange(data)),
      tap(() => this.areaDerechoService.setMessageChange(msg))
    ).subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}