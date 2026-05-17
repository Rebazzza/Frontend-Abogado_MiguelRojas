import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AbogadoComponent } from './pages/abogado/abogado.component';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { LayoutComponent } from './pages/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    AbogadoComponent,
    UsuarioComponent,
    LayoutComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('MiguelRojas-frontend');
}
