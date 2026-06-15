import { Routes } from '@angular/router';
import { AbogadoComponent } from './pages/abogado/abogado.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { AreaDerechoComponent } from './pages/area-derecho/area-derecho.component';
import { casoComponent } from './pages/casos/casos.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { EspecialistaComponent } from './pages/especialista/especialista.component';
import { PagoComponent } from './pages/pago/pago.component';
import { ServicioLegalComponent } from './pages/servicio-legal/servicio-legal.component';
import { AudienciaComponent } from './pages/audiencia/audiencia.component';
import { CitaComponent } from './pages/cita/cita.component';


export const routes: Routes = [
    {
         path: 'pages/abogado', component: AbogadoComponent,
         children:[
            {path:'new',component: AbogadoComponent},
            {path:'edit/:id',component: AbogadoComponent},
         ]
        },
        {path:'pages/area_derecho',component:AreaDerechoComponent},
        {path:'pages/audiencia',component:AudienciaComponent},        
        {path:'pages/usuario',component:UsuarioComponent},
        {path:'pages/caso',component:casoComponent},
        {path:'pages/cliente',component:ClienteComponent},
        {path:'pages/cita',component:CitaComponent},
        {path:'pages/especialista',component:EspecialistaComponent},
        {path:'pages/pago',component:PagoComponent},
        {path:'pages/servicio_legal',component:ServicioLegalComponent},
        {path:'pages/usuario',component:UsuarioComponent},
      

    
];
