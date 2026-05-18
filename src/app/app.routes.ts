import { Routes } from '@angular/router';
import { AbogadoComponent } from './pages/abogado/abogado.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';


export const routes: Routes = [
    {
         path: 'pages/abogado', component: AbogadoComponent,
         children:[
            {path:'new',component: AbogadoComponent},
            {path:'edit/:id',component: AbogadoComponent},
         ]
        },
        {path:'pages/usuario',component:UsuarioComponent}
    
];
