import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';
import { AbogadoService } from '../../services/abogado.service';
import { ClienteService } from '../../services/cliente.service';
import { CasoService } from '../../services/casos.service';
import { CitaService } from '../../services/cita.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly abogadoService = inject(AbogadoService);
  private readonly clienteService = inject(ClienteService);
  private readonly casoService = inject(CasoService);
  private readonly citaService = inject(CitaService);

  protected username = this.authService.$username;
  protected today = new Date();
  protected stats = signal<{ label: string; icon: string; value: number; route: string; color: string }[]>([]);
  protected proximasCitas = signal<{ cliente: string; asunto: string; fecha: string }[]>([]);
  protected loading = signal(true);

  ngOnInit(): void {
    this.cargarStats();
  }

  private cargarStats(): void {
    this.abogadoService.findAll().subscribe((abogados) => {
      this.clienteService.findAll().subscribe((clientes) => {
        this.casoService.findAll().subscribe((casos) => {
          this.citaService.findAll().subscribe((citas) => {
            const activas = citas.filter((c) => c.activa);

            this.stats.set([
              { label: 'Abogados', icon: 'gavel', value: abogados.length, route: '/pages/abogado', color: '#1976d2' },
              { label: 'Clientes', icon: 'people', value: clientes.length, route: '/pages/cliente', color: '#388e3c' },
              { label: 'Casos', icon: 'work', value: casos.length, route: '/pages/caso', color: '#f57c00' },
              { label: 'Citas activas', icon: 'event', value: activas.length, route: '/pages/cita', color: '#7b1fa2' },
            ]);

            this.proximasCitas.set(
              activas.slice(0, 5).map((c) => ({
                cliente: c.nombreCliente,
                asunto: c.asuntoLegal,
                fecha: new Date(c.fechaHora).toLocaleDateString('es-PE', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              }))
            );

            this.loading.set(false);
          });
        });
      });
    });
  }
}
