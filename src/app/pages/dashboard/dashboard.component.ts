import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { AbogadoService } from '../../services/abogado.service';
import { ClienteService } from '../../services/cliente.service';
import { CasoService } from '../../services/casos.service';
import { CitaService } from '../../services/cita.service';
import { PagoService } from '../../services/pago.service';
import { cita } from '../../model/cita';
import { pago } from '../../model/pago';
import { Casos } from '../../model/Caso';

interface ChartSlice {
  label: string;
  value: number;
  color: string;
  pct: number;
}
interface ChartPieData {
  slices: ChartSlice[];
  gradient: string;
}
interface ChartBarData {
  bars: { label: string; value: number }[];
  max: number;
}

interface CalDay {
  day: number;
  isToday: boolean;
  hasCitas: boolean;
  dateStr: string;
}

interface DayCita {
  hora: string;
  cliente: string;
  asunto: string;
  detalles: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatListModule, MatTooltipModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly abogadoService = inject(AbogadoService);
  private readonly clienteService = inject(ClienteService);
  private readonly casoService = inject(CasoService);
  private readonly citaService = inject(CitaService);
  private readonly pagoService = inject(PagoService);

  protected username = this.authService.$username;
  protected today = new Date();
  protected stats = signal<{ label: string; icon: string; value: number; route: string; color: string }[]>([]);
  protected proximasCitas = signal<{ nombre: string; asunto: string; fecha: string }[]>([]);
  protected loading = signal(true);
  protected clientesMap = new Map<number, string>();

  calendarYear = signal(this.today.getFullYear());
  calendarMonth = signal(this.today.getMonth());
  citasMap = new Map<string, cita[]>();
  protected weeks = signal<CalDay[][]>([]);

  protected selectedDateStr = signal('');
  protected selectedCitas = signal<DayCita[]>([]);

  protected monthLabel = computed(() => {
    const d = new Date(this.calendarYear(), this.calendarMonth());
    return d.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
  });

  protected selectedLabel = computed(() => {
    if (!this.selectedDateStr()) return '';
    const d = new Date(this.selectedDateStr() + 'T12:00:00');
    return d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
  });

  protected chartClientesTipo = signal<ChartPieData | null>(null);
  protected chartCasosEstado = signal<ChartPieData | null>(null);
  protected chartPagosMetodo = signal<ChartPieData | null>(null);
  protected chartCitasSemana = signal<ChartBarData | null>(null);

  ngOnInit(): void {
    this.cargarStats();
  }

  prevMonth(): void {
    const m = this.calendarMonth();
    if (m === 0) {
      this.calendarMonth.set(11);
      this.calendarYear.set(this.calendarYear() - 1);
    } else {
      this.calendarMonth.set(m - 1);
    }
    this.selectedDateStr.set('');
    this.selectedCitas.set([]);
    this.buildWeeks();
  }

  nextMonth(): void {
    const m = this.calendarMonth();
    if (m === 11) {
      this.calendarMonth.set(0);
      this.calendarYear.set(this.calendarYear() + 1);
    } else {
      this.calendarMonth.set(m + 1);
    }
    this.selectedDateStr.set('');
    this.selectedCitas.set([]);
    this.buildWeeks();
  }

  selectDay(day: number): void {
    const dateStr = `${this.calendarYear()}-${String(this.calendarMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    this.selectedDateStr.set(dateStr);

    const citasDelDia = this.citasMap.get(dateStr) ?? [];
    this.selectedCitas.set(
      citasDelDia.map((c) => ({
        hora: new Date(c.fechaHora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        cliente: this.clientesMap.get(c.idCliente) ?? c.idCliente.toString(),
        asunto: c.asuntoLegal,
        detalles: c.detallesAdicionales ?? '',
      }))
    );
  }

  private buildWeeks(): void {
    const year = this.calendarYear();
    const month = this.calendarMonth();
    const first = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: CalDay[][] = [];
    let week: CalDay[] = [];

    const emptyBefore = first === 0 ? 6 : first - 1;
    for (let i = 0; i < emptyBefore; i++) {
      week.push({ day: 0, isToday: false, hasCitas: false, dateStr: '' });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = year === this.today.getFullYear() && month === this.today.getMonth() && d === this.today.getDate();
      const hasCitas = this.citasMap.has(dateStr);
      week.push({ day: d, isToday, hasCitas, dateStr });

      if (!this.selectedDateStr() && isToday && hasCitas) {
        this.selectedDateStr.set(dateStr);
      }

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push({ day: 0, isToday: false, hasCitas: false, dateStr: '' });
      }
      weeks.push(week);
    }

    this.weeks.set(weeks);

    if (this.selectedDateStr()) {
      const initial = this.citasMap.get(this.selectedDateStr()) ?? [];
      this.selectedCitas.set(
        initial.map((c) => ({
          hora: new Date(c.fechaHora).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
          cliente: this.clientesMap.get(c.idCliente) ?? c.idCliente.toString(),
          asunto: c.asuntoLegal,
          detalles: c.detallesAdicionales ?? '',
        }))
      );
    }
  }

  private pct(v: number, total: number): number {
    return total > 0 ? Math.round((v / total) * 100) : 0;
  }

  private cargarStats(): void {
    this.clienteService.findAll().subscribe((clientes) => {
      for (const c of clientes) {
        this.clientesMap.set(c.idCliente, c.nombre || c.dni || c.idCliente.toString());
      }

      this.abogadoService.findAll().subscribe((abogados) => {
        this.casoService.findAll().subscribe((casos) => {
          this.citaService.findAll().subscribe((citas) => {
            this.pagoService.findAll().subscribe((pagos) => {
              const activas = citas.filter((c) => c.activa);
              const total = clientes.length + abogados.length + casos.length + activas.length;

              this.stats.set([
                { label: 'Abogados', icon: 'gavel', value: abogados.length, route: '/pages/abogado', color: '#1976d2' },
                { label: 'Clientes', icon: 'people', value: clientes.length, route: '/pages/cliente', color: '#388e3c' },
                { label: 'Casos', icon: 'work', value: casos.length, route: '/pages/caso', color: '#f57c00' },
                { label: 'Citas activas', icon: 'event', value: activas.length, route: '/pages/cita', color: '#7b1fa2' },
              ]);

              this.proximasCitas.set(
                activas.slice(0, 5).map((c) => ({
                  nombre: this.clientesMap.get(c.idCliente) ?? c.idCliente.toString(),
                  asunto: c.asuntoLegal,
                  fecha: new Date(c.fechaHora).toLocaleDateString('es-PE', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                }))
              );

              for (const c of citas) {
                const dateKey = new Date(c.fechaHora).toISOString().slice(0, 10);
                if (!this.citasMap.has(dateKey)) this.citasMap.set(dateKey, []);
                this.citasMap.get(dateKey)!.push(c);
              }

              this.processCharts(clientes, casos, pagos, citas);
              this.buildWeeks();
              this.loading.set(false);
            });
          });
        });
      });
    });
  }

  private buildGradient(slices: ChartSlice[]): string {
    if (slices.length === 0) return '';
    return 'conic-gradient(' + slices.map((s, i) => {
      const start = slices.slice(0, i).reduce((sum, x) => sum + x.pct, 0);
      return s.color + ' ' + start + '% ' + (start + s.pct) + '%';
    }).join(', ') + ')';
  }

  private processCharts(clientes: any[], casos: Casos[], pagos: pago[], citas: cita[]): void {
    const colors = ['#388e3c', '#f57c00', '#1976d2', '#7b1fa2', '#e91e63', '#00bcd4'];

    // 1. Clientes por tipo
    const tipoMap = new Map<string, number>();
    for (const c of clientes) {
      const key = c.tipoCliente || 'Natural';
      tipoMap.set(key, (tipoMap.get(key) ?? 0) + 1);
    }
    const tipoTotal = clientes.length;
    const tipoSlices = Array.from(tipoMap.entries())
      .map(([label, value], i) => ({ label, value, color: colors[i], pct: this.pct(value, tipoTotal) }))
      .sort((a, b) => b.value - a.value);
    this.chartClientesTipo.set({ slices: tipoSlices, gradient: this.buildGradient(tipoSlices) });

    // 2. Casos por estado
    const activos = casos.filter((c) => c.estado).length;
    const cerrados = casos.length - activos;
    const casoTotal = casos.length;
    const casoSlices = [
      { label: 'Activos', value: activos, color: '#f57c00', pct: this.pct(activos, casoTotal) },
      { label: 'Cerrados', value: cerrados, color: '#888', pct: this.pct(cerrados, casoTotal) },
    ];
    this.chartCasosEstado.set({ slices: casoSlices, gradient: this.buildGradient(casoSlices) });

    // 3. Pagos por método
    const metodoMap = new Map<string, number>();
    for (const p of pagos) {
      const key = p.metodoPago || 'Otro';
      metodoMap.set(key, (metodoMap.get(key) ?? 0) + 1);
    }
    const pagoTotal = pagos.length;
    const metodoSlices = Array.from(metodoMap.entries())
      .map(([label, value], i) => ({ label, value, color: colors[i], pct: this.pct(value, pagoTotal) }))
      .sort((a, b) => b.value - a.value);
    this.chartPagosMetodo.set({ slices: metodoSlices, gradient: this.buildGradient(metodoSlices) });

    // 4. Citas por día de la semana
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dayCount = [0, 0, 0, 0, 0, 0, 0];
    for (const c of citas) {
      const d = new Date(c.fechaHora).getDay();
      dayCount[d]++;
    }
    const max = Math.max(...dayCount, 1);
    this.chartCitasSemana.set({
      bars: diasSemana.map((label, i) => ({ label, value: dayCount[i] })),
      max,
    });
  }
}
