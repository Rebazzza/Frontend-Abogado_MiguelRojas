import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbogadoService } from '../../../services/abogado.service';
import { switchMap, tap } from 'rxjs';
import { Abogado } from '../../../model/abogado';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-abogado-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './abogado-dialog.component.html'
})
export class AbogadoDialogComponent implements OnInit {
  private readonly abogadoService = inject(AbogadoService);
  protected readonly data: Abogado = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AbogadoDialogComponent>);

  protected form!: FormGroup;
  protected edicion: boolean = false;

  ngOnInit(): void {
    this.edicion = this.data != null && this.data.idAbogado > 0;

    this.form = new FormGroup({
      idAbogado: new FormControl(this.data?.idAbogado ?? null),
      nombre: new FormControl(this.data?.nombre ?? '', [Validators.required]),
      apellido: new FormControl(this.data?.apellido ?? '', [Validators.required]),
      correo: new FormControl(this.data?.correo ?? '', [Validators.required, Validators.email]),
      telefono: new FormControl(this.data?.telefono ?? '', [Validators.required]),
      especialidad: new FormControl(this.data?.especialidad ?? '', [Validators.required]),
      dni: new FormControl(this.data?.dni ?? '', [Validators.required, Validators.minLength(8)])
    });
  }
  
  operate(){
    if (this.form.invalid) return;

    const abogadoValue: Abogado = this.form.value;
    const msg = this.edicion ? 'UPDATED' : 'CREATED';
    
    const operation$ = this.edicion 
      ? this.abogadoService.update(abogadoValue.idAbogado, abogadoValue) 
      : this.abogadoService.save(abogadoValue);

    operation$.pipe(
      switchMap(() => this.abogadoService.findAll()),
      tap(data => this.abogadoService.setListChange(data)),
      tap(() => this.abogadoService.setMessageChange(msg))
    )
    .subscribe(() => this.close());
  }

  close(){
    this.dialogRef.close();
  }
}