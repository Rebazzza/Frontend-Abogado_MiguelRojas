import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Agregamos ChangeDetectorRef
import { CommonModule } from '@angular/common'; // 2. Agregamos CommonModule para el *ngIf de los mat-error
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
    CommonModule, // <-- Soluciona el error NG0303 al abrir el diálogo
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
  private readonly cdr = inject(ChangeDetectorRef); // <-- Para controlar los cambios asíncronos de los combos
  protected readonly data: Audiencia = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AudienciaDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;
  protected abogados: Abogado[] = [];
  protected casos: Casos[] = [];

  ngOnInit(): void {
    this.edicion = this.data != null && (this.data.idAudiencia ?? 0) > 0;

    // Mantenemos tu inicialización de formulario idéntica para que no rompa tu backend
    this.form = new FormGroup({
      idAudiencia: new FormControl(this.data?.idAudiencia ?? null),
      fecha: new FormControl(this.data?.fecha ?? '', [Validators.required]),
      hora: new FormControl(this.data?.hora ?? ''), // Dejado exactamente como lo tenías
      tipoAudiencia: new FormControl(this.data?.tipoAudiencia ?? ''),
      direccion: new FormControl(this.data?.direccion ?? '', [Validators.required]),
      lugarLink: new FormControl(this.data?.lugarLink ?? ''),
      idAbogado: new FormControl(this.data?.idAbogado ?? null, [Validators.required]),
      idCaso: new FormControl(this.data?.idCaso ?? null, [Validators.required]),
    });

    // Cargamos los combos e indicamos a Angular que refresque la vista de forma segura
    this.abogadoService.findAll().subscribe((data) => {
      this.abogados = data;
      this.cdr.detectChanges(); // <-- Detiene el error NG0100 en los mat-select
    });

    this.casoService.findAll().subscribe((data) => {
      this.casos = data;
      this.cdr.detectChanges(); // <-- Detiene el error NG0100 en los mat-select
    });
  }

  // Tu método operate intacto que me confirmas que funciona
 operate() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    // === SOLUCIÓN AL PARSEO DE LOCALDATETIME ===
    // Si la hora es solo un texto tipo "09:00", le unimos la fecha para crear un ISO string compatible con LocalDateTime
    let horaFinal = formValue.hora;
    if (horaFinal && !horaFinal.includes('T') && formValue.fecha) {
      horaFinal = `${formValue.fecha}T${horaFinal.substring(0, 5)}:00`;
    }

    // Construimos el JSON plano exacto que copia los campos de tu AudienciaDTO.java
    const audienciaPayload: any = {
      idAudiencia: formValue.idAudiencia,
      fecha: formValue.fecha,
      direccion: formValue.direccion,
      idAbogado: formValue.idAbogado ? Number(formValue.idAbogado) : null, // Envía el número plano esperado
      hora: horaFinal, // Envía el formato LocalDateTime compatible
      tipoAudiencia: formValue.tipoAudiencia,
      lugarLink: formValue.lugarLink,
      idCaso: formValue.idCaso ? Number(formValue.idCaso) : null // Envía el número plano esperado
    };

    console.log("Payload exacto enviado a tu AudienciaDTO:", audienciaPayload);

    const msg = this.edicion ? 'UPDATED' : 'CREATED';

    const operation$ = this.edicion
      ? this.audienciaService.update(audienciaPayload.idAudiencia!, audienciaPayload)
      : this.audienciaService.save(audienciaPayload);

    operation$.pipe(
      switchMap(() => this.audienciaService.findAll()),
      tap((data) => this.audienciaService.setListChange(data)),
      tap(() => this.audienciaService.setMessageChange(msg))
    ).subscribe({
      next: () => this.close(),
      error: (err) => console.error("Error devuelto por el backend:", err)
    });
  }

  close() {
    this.dialogRef.close();
  }
}