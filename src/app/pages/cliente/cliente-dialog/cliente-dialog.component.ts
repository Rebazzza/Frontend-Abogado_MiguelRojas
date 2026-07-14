import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import { AbogadoService } from '../../../services/abogado.service';
import { Cliente } from '../../../model/cliente';
import { Abogado } from '../../../model/abogado';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-cliente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cliente-dialog.component.html',
})
export class ClienteDialogComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly abogadoService = inject(AbogadoService);
  protected readonly data: Cliente = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ClienteDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected abogados: Abogado[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && (this.data.idCliente ?? 0) > 0;

    this.abogadoService.findAll().subscribe(list => this.abogados = list);

    this.form = new FormGroup({
      idCliente: new FormControl(this.data?.idCliente ?? null),
      nombre: new FormControl(this.data?.nombre ?? '', [Validators.required]),
      descripcion: new FormControl(this.data?.descripcion ?? ''),
      dni: new FormControl(this.data?.dni ?? '', [Validators.minLength(8), Validators.maxLength(8)]),
      RUC: new FormControl(this.data?.RUC ?? ''),
      telefono: new FormControl(this.data?.telefono ?? '', [Validators.required, Validators.pattern(/^9\d{8}$/)]),
      direccion: new FormControl(this.data?.direccion ?? ''),
      correo: new FormControl(this.data?.correo ?? '', [Validators.email]),
      tipoCliente: new FormControl(this.data?.tipoCliente ?? 'Natural'),
      estado: new FormControl(this.data?.estado ?? true),
      idAbogado: new FormControl(this.data?.idAbogado ?? null),
    });
  }

  operate() {
    if (this.form.invalid) return;

    const value: Cliente = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.clienteService.update(value.idCliente!, value)
      : this.clienteService.save(value);

    operation$.pipe(
      switchMap(() => this.clienteService.findAll()),
      tap((data) => this.clienteService.setListChange(data)),
      tap(() => this.clienteService.setMessageChange(msg))
    ).subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}
