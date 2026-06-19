import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CasoService } from '../../../services/casos.service';
import { Casos } from '../../../model/Caso';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-casos-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './casos-dialog.component.html',
})
export class CasosDialogComponent implements OnInit {
  private readonly casosService = inject(CasoService);
  protected readonly data: Casos = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<CasosDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;

  ngOnInit(): void {
    this.edicion = this.data != null && (this.data.idCaso ?? 0) > 0;

    this.form = new FormGroup({
      idCaso: new FormControl(this.data?.idCaso ?? null),
      titulo: new FormControl(this.data?.titulo ?? '', [Validators.required]),
      descripcion: new FormControl(this.data?.descripcion ?? '', [Validators.required]),
      estado: new FormControl(this.data?.estado ?? false),
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
