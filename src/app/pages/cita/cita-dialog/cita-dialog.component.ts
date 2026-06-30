import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CitaService } from '../../../services/cita.service';
import { ClienteService } from '../../../services/cliente.service';
import { AbogadoService } from '../../../services/abogado.service';
import { cita } from '../../../model/cita';
import { Cliente } from '../../../model/cliente';
import { Abogado } from '../../../model/abogado';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-cita-dialog',
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
  templateUrl: './cita-dialog.component.html',
})
export class CitaDialogComponent implements OnInit {
  private readonly citaService = inject(CitaService);
  private readonly clienteService = inject(ClienteService);
  private readonly abogadoService = inject(AbogadoService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly data: cita = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CitaDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected clientes: Cliente[] = [];
  protected abogados: Abogado[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && (this.data.idCita ?? 0) > 0;

    this.form = new FormGroup({
      idCita: new FormControl(this.data?.idCita ?? null),
      asuntoLegal: new FormControl(this.data?.asuntoLegal ?? '', [Validators.required]),
      detallesAdicionales: new FormControl(this.data?.detallesAdicionales ?? ''),
      fechaHora: new FormControl(this.data?.fechaHora ?? '', [Validators.required]),
      activa: new FormControl(this.data?.activa ?? true),
      idCliente: new FormControl(this.data?.idCliente ?? null, [Validators.required]),
      idAbogado: new FormControl(this.data?.idAbogado ?? null, [Validators.required]),
    });

    this.clienteService.findAll().subscribe((data) => {
      this.clientes = data;
      this.cdr.detectChanges();
    });

    this.abogadoService.findAll().subscribe((data) => {
      this.abogados = data;
      this.cdr.detectChanges();
    });
  }

  operate() {
    if (this.form.invalid) return;

    const value: cita = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.citaService.update(value.idCita!, value)
      : this.citaService.save(value);

    operation$.pipe(
      switchMap(() => this.citaService.findAll()),
      tap((data) => this.citaService.setListChange(data)),
      tap(() => this.citaService.setMessageChange(msg))
    ).subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}
