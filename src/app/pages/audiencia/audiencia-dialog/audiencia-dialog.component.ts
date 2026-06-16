import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AudienciaService } from '../../../services/audiencia.service';
import { AbogadoService } from '../../../services/abogado.service';
import { CasoService } from '../../../services/casos.service';
import { Audiencia } from '../../../model/audiencia';
import { Abogado } from '../../../model/abogado';
import { Casos } from '../../../model/Caso';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-audiencia-dialog',
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
  templateUrl: './audiencia-dialog.component.html',
})
export class AudienciaDialogComponent implements OnInit {
  private readonly audienciaService = inject(AudienciaService);
  private readonly abogadoService = inject(AbogadoService);
  private readonly casoService = inject(CasoService);
  protected readonly data: Audiencia = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AudienciaDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected abogados: Abogado[] = [];
  protected casos: Casos[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && (this.data.idAudiencia ?? 0) > 0;

    this.form = new FormGroup({
      idAudiencia: new FormControl(this.data?.idAudiencia ?? null),
      fecha: new FormControl(this.data?.fecha ?? '', [Validators.required]),
      hora: new FormControl(this.data?.hora ?? ''),
      tipoAudiencia: new FormControl(this.data?.tipoAudiencia ?? ''),
      direccion: new FormControl(this.data?.direccion ?? '', [Validators.required]),
      lugarLink: new FormControl(this.data?.lugarLink ?? ''),
      idAbogado: new FormControl(this.data?.idAbogado ?? null, [Validators.required]),
      idCaso: new FormControl(this.data?.idCaso ?? null, [Validators.required]),
    });

    this.abogadoService.findAll().subscribe((data) => (this.abogados = data));
    this.casoService.findAll().subscribe((data) => (this.casos = data));
  }

  operate() {
    if (this.form.invalid) return;

    const value: Audiencia = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.audienciaService.update(value.idAudiencia!, value)
      : this.audienciaService.save(value);

    operation$.pipe(
      switchMap(() => this.audienciaService.findAll()),
      tap((data) => this.audienciaService.setListChange(data)),
      tap(() => this.audienciaService.setMessageChange(msg))
    ).subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}