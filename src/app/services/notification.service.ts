import { Injectable, inject, signal } from '@angular/core';
import { interval, switchMap } from 'rxjs';
import { CitaService } from './cita.service';

export interface Notification {
  id: string;
  type: 'cita' | 'audiencia' | 'pago';
  message: string;
  route: string;
  time: string;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly citaService = inject(CitaService);

  private readonly _notifications = signal<Notification[]>([]);
  readonly $notifications = this._notifications.asReadonly();

  private readonly _unreadCount = signal(0);
  readonly $unreadCount = this._unreadCount.asReadonly();

  constructor() {
    this.refresh();
    interval(60000).subscribe(() => this.refresh());
  }

  refresh(): void {
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);

    this.citaService.findAll().subscribe((citas) => {
      const notifications: Notification[] = [];

      for (const c of citas) {
        if (!c.activa) continue;
        const citaDate = new Date(c.fechaHora);

        if (citaDate >= now && citaDate <= tomorrowEnd) {
          const diffMs = citaDate.getTime() - now.getTime();
          const diffH = Math.round(diffMs / 3600000);
          const label = diffH < 1 ? 'En menos de 1 hora' : diffH < 24 ? `En ${diffH}h` : 'Mañana';

          notifications.push({
            id: `cita-${c.idCita}`,
            type: 'cita',
            message: `Cita: ${c.asuntoLegal} — ${label}`,
            route: '/pages/calendar',
            time: citaDate.toISOString(),
            read: false,
          });
        }
      }

      notifications.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      this._notifications.set(notifications);
      this._unreadCount.set(notifications.filter((n) => !n.read).length);
    });
  }

  markAsRead(id: string): void {
    this._notifications.update((list) =>
      list.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    this._unreadCount.set(this._notifications().filter((n) => !n.read).length);
  }

  markAllAsRead(): void {
    this._notifications.update((list) => list.map((n) => ({ ...n, read: true })));
    this._unreadCount.set(0);
  }
}
