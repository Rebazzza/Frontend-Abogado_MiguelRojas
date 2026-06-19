import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AbogadoComponent } from './pages/abogado/abogado.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { AreaDerechoComponent } from './pages/area-derecho/area-derecho.component';
import { CasosComponent } from './pages/casos/casos.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { EspecialistaComponent } from './pages/especialista/especialista.component';
import { PagoComponent } from './pages/pago/pago.component';
import { ServicioLegalComponent } from './pages/servicio-legal/servicio-legal.component';
import { AudienciaComponent } from './pages/audiencia/audiencia.component';
import { CitaComponent } from './pages/cita/cita.component';
import { ExpedienteComponent } from './pages/expediente/expediente.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'pages',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'abogado', component: AbogadoComponent,
        children: [
          { path: 'new', component: AbogadoComponent },
          { path: 'edit/:id', component: AbogadoComponent },
        ],
      },
      { path: 'area_derecho', component: AreaDerechoComponent },
      { path: 'audiencia', component: AudienciaComponent },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'caso', component: CasosComponent },
      { path: 'cliente', component: ClienteComponent },
      { path: 'cita', component: CitaComponent },
      { path: 'especialista', component: EspecialistaComponent },
      { path: 'pago', component: PagoComponent },
      { path: 'servicio_legal', component: ServicioLegalComponent },
      { path: 'expediente', component: ExpedienteComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
