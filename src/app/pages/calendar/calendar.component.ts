import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { CitaService } from '../../services/cita.service';
import { cita } from '../../model/cita';
import { MatDialog } from '@angular/material/dialog';
import { CitaDialogComponent } from '../cita/cita-dialog/cita-dialog.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MatCardModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  private readonly citaService = inject(CitaService);
  private readonly dialog = inject(MatDialog);

  protected calendarOptions: any = {};
  protected loading = signal(true);

  ngOnInit(): void {
    this.citaService.findAll().subscribe((citas) => {
      const events = citas.map((c: cita) => ({
        id: String(c.idCita),
        title: c.asuntoLegal,
        start: c.fechaHora,
        extendedProps: {
          cliente: c.idCliente,
          abogado: c.idAbogado,
          detalles: c.detallesAdicionales,
        },
        backgroundColor: c.activa ? '#1976d2' : '#9e9e9e',
      }));

      this.calendarOptions = {
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        },
        locale: esLocale,
        buttonText: {
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          list: 'Lista',
        },
        editable: false,
        selectable: true,
        events,
        dateClick: (info: any) => this.openNewDialog(info.dateStr),
        eventClick: (info: any) => this.openEditDialog(Number(info.event.id)),
        height: 'auto',
      };

      this.loading.set(false);
    });
  }

  private openNewDialog(dateStr: string): void {
    const cita = { fechaHora: dateStr + 'T00:00' } as cita;
    this.dialog.open(CitaDialogComponent, {
      width: '650px',
      data: cita,
    });
  }

  private openEditDialog(id: number): void {
    this.citaService.findById(id).subscribe((cita) => {
      this.dialog.open(CitaDialogComponent, {
        width: '650px',
        data: cita,
      });
    });
  }
}
