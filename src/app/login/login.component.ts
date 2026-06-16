import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  // Formulario Reactivo con validación de longitud mínima de 3 caracteres
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  // Signal para gestionar el estado de carga visual del botón
  isLoggingIn = signal(false);

  // Función directa evaluada por Angular en tiempo real para habilitar/deshabilitar el botón
  isFormValid(): boolean {
    return this.loginForm.valid;
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoggingIn.set(true);
      console.log('Logging in with:', this.loginForm.value);
      
      // Obtenemos los valores de manera segura
      const username = this.loginForm.value.username ?? '';
      const password = this.loginForm.value.password ?? '';

      this.loginService.login(username, password).subscribe({
        next: (data) => {
          // Guardamos el token en el sessionStorage
          sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);
          
          // Apagamos el estado de carga justo antes de redirigir
          this.isLoggingIn.set(false); 
          
          // Redirección a la pantalla de tu sistema
          this.router.navigate(['/pages/category']);
        },
        error: (err) => {
          console.error('Error en las credenciales de inicio de sesión:', err);
          
          // Si los datos son incorrectos, apagamos la carga para que el usuario pueda intentar de nuevo
          this.isLoggingIn.set(false);
          
          alert('Usuario o contraseña incorrectos. Por favor, intente de nuevo.');
        }
      });
    }
  }
}