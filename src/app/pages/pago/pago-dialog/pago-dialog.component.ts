import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { PagoService } from '../../../services/pago.service';
import { CasoService } from '../../../services/casos.service';
import { pago } from '../../../model/pago';
import { Casos } from '../../../model/Caso';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-pago-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pago-dialog.component.html',
})
export class PagoDialogComponent implements OnInit {
  private readonly pagoService = inject(PagoService);
  private readonly casoService = inject(CasoService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly data: pago = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<PagoDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected casos: Casos[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && (this.data.idPago ?? 0) > 0;

    this.form = new FormGroup({
      idPago: new FormControl(this.data?.idPago ?? null),
      monto: new FormControl(this.data?.monto ?? '', [Validators.required, Validators.min(0.01)]),
      metodoPago: new FormControl(this.data?.metodoPago ?? '', [Validators.required]),
      fechaPago: new FormControl(this.data?.fechaPago ?? '', [Validators.required]),
      estadoPago: new FormControl(this.data?.estadoPago ?? true),
      idCaso: new FormControl(this.data?.idCaso ?? null, [Validators.required]),
    });

    this.casoService.findAll().subscribe((data) => {
      this.casos = data;
      this.cdr.detectChanges();
    });
  }

  operate() {
    if (this.form.invalid) return;

    const value: pago = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.pagoService.update(value.idPago!, value)
      : this.pagoService.save(value);

    operation$.pipe(
      switchMap(() => this.pagoService.findAll()),
      tap((data) => this.pagoService.setListChange(data)),
      tap(() => this.pagoService.setMessageChange(msg))
    ).subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}
