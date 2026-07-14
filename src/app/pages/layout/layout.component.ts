import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { NotificationBellComponent } from '../../components/notification-bell/notification-bell.component';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  imports: [
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    NotificationBellComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private readonly authService = inject(AuthService);

  protected searchQuery = signal('');
  protected username = this.authService.$username;

  private readonly ALL_MENU_ITEMS: Record<string, MenuItem[]> = {
    ADMIN: [
      { icon: 'dashboard', label: 'Dashboard', route: '/pages/dashboard' },
      { icon: 'calendar_month', label: 'Calendario', route: '/pages/calendar' },
      { icon: 'gavel', label: 'Abogados', route: '/pages/abogado' },
      { icon: 'balance', label: 'Audiencias', route: '/pages/audiencia' },
      { icon: 'work', label: 'Casos', route: '/pages/caso' },
      { icon: 'people', label: 'Clientes', route: '/pages/cliente' },
      { icon: 'psychology', label: 'Especialista', route: '/pages/especialista' },
      { icon: 'folder_open', label: 'Expediente', route: '/pages/expediente' },
      { icon: 'payments', label: 'Pagos', route: '/pages/pago' },
      { icon: 'person', label: 'Usuario', route: '/pages/usuario' },
      { icon: 'balance', label: 'Áreas de Derecho', route: '/pages/area_derecho' },
      { icon: 'event_available', label: 'Citas', route: '/pages/cita' },
      { icon: 'handyman', label: 'Servicio Legal', route: '/pages/servicio_legal' },
    ],
    ABOGADO: [
      { icon: 'dashboard', label: 'Dashboard', route: '/pages/dashboard' },
      { icon: 'calendar_month', label: 'Calendario', route: '/pages/calendar' },
      { icon: 'balance', label: 'Audiencias', route: '/pages/audiencia' },
      { icon: 'work', label: 'Casos', route: '/pages/caso' },
      { icon: 'people', label: 'Clientes', route: '/pages/cliente' },
      { icon: 'psychology', label: 'Especialista', route: '/pages/especialista' },
      { icon: 'folder_open', label: 'Expediente', route: '/pages/expediente' },
      { icon: 'payments', label: 'Pagos', route: '/pages/pago' },
      { icon: 'balance', label: 'Áreas de Derecho', route: '/pages/area_derecho' },
      { icon: 'event_available', label: 'Citas', route: '/pages/cita' },
      { icon: 'handyman', label: 'Servicio Legal', route: '/pages/servicio_legal' },
    ],
  };

  private readonly role = computed(() => {
    try {
      const token = sessionStorage.getItem(environment.TOKEN_NAME);
      if (!token) return '';
      return JSON.parse(atob(token.split('.')[1])).role || '';
    } catch {
      return '';
    }
  });

  private readonly menuForRole = computed(() => {
    return this.ALL_MENU_ITEMS[this.role()] ?? this.ALL_MENU_ITEMS['ABOGADO'];
  });

  protected filteredItems = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const items = this.menuForRole();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  });

  protected hasFilteredResults = computed(() => this.filteredItems().length > 0);

  logout(): void {
    this.authService.logout();
  }
}
