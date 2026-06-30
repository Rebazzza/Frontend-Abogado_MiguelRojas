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
import { ExpedienteService } from '../../../services/expediente.service';
import { CasoService } from '../../../services/casos.service';
import { expediente } from '../../../model/expediente';
import { Casos } from '../../../model/Caso';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-expediente-dialog',
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
  templateUrl: './expediente-dialog.component.html',
})
export class ExpedienteDialogComponent implements OnInit {
  private readonly expedienteService = inject(ExpedienteService);
  private readonly casoService = inject(CasoService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly data: expediente = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ExpedienteDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected casos: Casos[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && (this.data.idExPediente ?? 0) > 0;

    this.form = new FormGroup({
      idExPediente: new FormControl(this.data?.idExPediente ?? null),
      titulo: new FormControl(this.data?.titulo ?? '', [Validators.required]),
      tipoExpediente: new FormControl(this.data?.tipoExpediente ?? '', [Validators.required]),
      resumenExpediente: new FormControl(this.data?.resumenExpediente ?? ''),
      victima: new FormControl(this.data?.victima ?? ''),
      victimario: new FormControl(this.data?.victimario ?? ''),
      fechaInicio: new FormControl(this.data?.fechaInicio ?? ''),
      fechaCierre: new FormControl(this.data?.fechaCierre ?? ''),
      estadoExpediente: new FormControl(this.data?.estadoExpediente ?? true),
      pdfExpediente: new FormControl(this.data?.pdfExpediente ?? ''),
      idCaso: new FormControl(this.data?.idCaso ?? null, [Validators.required]),
    });

    this.casoService.findAll().subscribe((data) => {
      this.casos = data;
      this.cdr.detectChanges();
    });
  }

  operate() {
    if (this.form.invalid) return;

    const value: expediente = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.expedienteService.update(value.idExPediente!, value)
      : this.expedienteService.save(value);

    operation$.pipe(
      switchMap(() => this.expedienteService.findAll()),
      tap((data) => this.expedienteService.setListChange(data)),
      tap(() => this.expedienteService.setMessageChange(msg))
    ).subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}
