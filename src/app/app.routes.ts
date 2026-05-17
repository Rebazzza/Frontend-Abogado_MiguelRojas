import { Routes } from '@angular/router';
import { AbogadoComponent } from './pages/abogado/abogado.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';


export const routes: Routes = [
    { path: 'pages/category', component: AbogadoComponent},
    { path: 'pages/exam', component: AbogadoComponent }
];
