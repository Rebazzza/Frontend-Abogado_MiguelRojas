import { Component, inject, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PagoService } from '../../services/pago.service';
import { pago } from '../../model/pago';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-pago',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.css',
})
export class PagoComponent {
  private readonly pagoService = inject(PagoService);
  private readonly snackBar = inject(MatSnackBar);

  protected $pagos = signal<pago[]>([]);
  protected $activeTab = signal<'pendientes' | 'liquidados'>('pendientes');
  protected $filterValue = signal<string>('');

  constructor() {
    this.loadPagos();
    this.initializeEffects();
  }

  private loadPagos(): void {
    this.pagoService.findAll().subscribe({
      next: (data: any) => this.pagoService.setExpedienteChange(data),
      error: (err) => console.error('Error al cargar pagos', err)
    });
  }

  private initializeEffects(): void {
    effect(() => {
      const data = this.pagoService.$expedienteChange();
      this.$pagos.set(data);
    });

    effect(() => {
      const message = this.pagoService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        untracked(() => this.pagoService.setMessageChange(''));
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.$filterValue.set(filterValue.toLowerCase());
  }

  getFilteredPagos(): pago[] {
    const pagos = this.$pagos();
    const activeTab = this.$activeTab();
    const filterValue = this.$filterValue();

    return pagos.filter(p => {
      // Filtrar por estado (pendiente: false, liquidado: true)
      const matchesTab = activeTab === 'pendientes' 
        ? !p.estadoPago
        : p.estadoPago;
      
      // Filtrar por búsqueda
      const matchesFilter = filterValue === '' ||
        String(p.idPago).toLowerCase().includes(filterValue) ||
        p.metodoPago.toLowerCase().includes(filterValue) ||
        String(this.formatMonto(p.monto)).toLowerCase().includes(filterValue);

      return matchesTab && matchesFilter;
    });
  }

  formatMonto(monto: any): string {
    if (typeof monto === 'number') {
      return monto.toFixed(2);
    }
    return '0.00';
  }

  delete(idPago: number): void {
    const ok = window.confirm('¿Estás seguro de que deseas eliminar este pago?');
    if (ok) {
      this.pagoService.delete(idPago)
        .pipe(
          switchMap(() => this.pagoService.findAll()),
          tap(data => this.pagoService.setExpedienteChange(data)),
          tap(() => this.pagoService.setMessageChange('PAGO ELIMINADO'))
        )
        .subscribe();
    }
  }
}
