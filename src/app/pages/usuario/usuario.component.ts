import { Component, inject } from '@angular/core';
import { usuario } from '../../model/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario',
  imports: [],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  protected usuarios: usuario[] = [];
  private readonly usuarioService = inject(UsuarioService);
    ngoInit() : void{
    // this.examService.findAll().subscribe(data => console.log(data));
    this.usuarioService.findAll().subscribe(data => this.usuarios = data);
  }
}
