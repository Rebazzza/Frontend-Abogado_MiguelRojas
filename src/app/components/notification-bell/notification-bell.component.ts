import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [
    CommonModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    RouterLink,
  ],
  template: `
    <button
      mat-icon-button
      [matBadge]="$unreadCount()"
      matBadgeColor="warn"
      matBadgeSize="small"
      [matMenuTriggerFor]="menu"
      (menuOpened)="markAllRead()"
      aria-label="Notificaciones"
    >
      <mat-icon>notifications</mat-icon>
    </button>

    <mat-menu #menu="matMenu" xPosition="before" class="notification-menu">
      <div class="notif-header">
        <strong>Notificaciones</strong>
        <button mat-button (click)="markAllRead()" *ngIf="$unreadCount() > 0">
          Marcar todo leído
        </button>
      </div>

      <ng-template matMenuContent>
        @if ($notifications().length === 0) {
          <div class="notif-empty">
            <mat-icon>check_circle</mat-icon>
            <span>No hay notificaciones</span>
          </div>
        } @else {
          <div class="notif-list">
            @for (n of $notifications(); track n.id) {
              <button
                mat-menu-item
                [routerLink]="n.route"
                (click)="markAsRead(n.id)"
                class="notif-item"
                [class.unread]="!n.read"
              >
                <mat-icon [color]="n.type === 'cita' ? 'primary' : 'accent'">
                  {{ n.type === 'cita' ? 'event' : n.type === 'audiencia' ? 'gavel' : 'payments' }}
                </mat-icon>
                <span>{{ n.message }}</span>
              </button>
            }
          </div>
        }
      </ng-template>
    </mat-menu>
  `,
  styles: [
    `
    .notification-menu { min-width: 350px; max-width: 450px; }
    .notif-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 16px; border-bottom: 1px solid #eee;
    }
    .notif-empty {
      display: flex; align-items: center; gap: 8px;
      padding: 24px 16px; color: #888; justify-content: center;
    }
    .notif-list { max-height: 350px; overflow-y: auto; }
    .notif-item span { white-space: normal; line-height: 1.3; }
    .unread { background: #e3f2fd; }
  `,
  ],
})
export class NotificationBellComponent {
  private readonly notifService = inject(NotificationService);
  protected readonly $notifications = this.notifService.$notifications;
  protected readonly $unreadCount = this.notifService.$unreadCount;

  markAsRead(id: string): void {
    this.notifService.markAsRead(id);
  }

  markAllRead(): void {
    this.notifService.markAllAsRead();
  }
}
