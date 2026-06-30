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
import { CasoService } from '../../../services/casos.service';
import { AbogadoService } from '../../../services/abogado.service';
import { ClienteService } from '../../../services/cliente.service';
import { Casos } from '../../../model/Caso';
import { Abogado } from '../../../model/abogado';
import { Cliente } from '../../../model/cliente';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-casos-dialog',
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
  templateUrl: './casos-dialog.component.html',
})
export class CasosDialogComponent implements OnInit {
  private readonly casosService = inject(CasoService);
  private readonly abogadoService = inject(AbogadoService);
  private readonly clienteService = inject(ClienteService);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly data: Casos = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CasosDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected abogados: Abogado[] = [];
  protected clientes: Cliente[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && (this.data.idCaso ?? 0) > 0;

    this.form = new FormGroup({
      idCaso: new FormControl(this.data?.idCaso ?? null),
      titulo: new FormControl(this.data?.titulo ?? '', [Validators.required]),
      descripcion: new FormControl(this.data?.descripcion ?? '', [Validators.required]),
      estado: new FormControl(this.data?.estado ?? false),
      idAbogado: new FormControl(this.data?.idAbogado ?? null, [Validators.required]),
      idCliente: new FormControl(this.data?.idCliente ?? null, [Validators.required]),
    });

    this.abogadoService.findAll().subscribe((data) => {
      this.abogados = data;
      this.cdr.detectChanges();
    });

    this.clienteService.findAll().subscribe((data) => {
      this.clientes = data;
      this.cdr.detectChanges();
    });
  }

  operate() {
    if (this.form.invalid) return;

    const value: Casos = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.casosService.update(value.idCaso!, value)
      : this.casosService.save(value);

    operation$.pipe(
      switchMap(() => this.casosService.findAll()),
      tap((data) => this.casosService.setListChange(data)),
      tap(() => this.casosService.setMessageChange(msg))
    ).subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}
