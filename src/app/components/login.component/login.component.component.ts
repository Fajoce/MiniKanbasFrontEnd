import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth.service.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './login.component.component.html',
  styleUrls: ['./login.component.component.scss']
})
export class LoginComponentComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthServiceService);
  router = inject(Router);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  errorMessage = '';

  constructor() {
    // Si ya hay token, redirige automáticamente al Kanban
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/kanban']);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    const user: User = {
      username: this.form.get('username')!.value!.trim(),
      password: this.form.get('password')!.value!,
      rol: 'user'
    };

    this.authService.login(user).subscribe({
      next: () => this.router.navigate(['/kanban']), // redirige al Kanban después del login
      error: () => this.errorMessage = 'Credenciales incorrectas'
    });
  }

  goToRegister() {
    this.router.navigate(['/register']); // si tienes un componente de registro
  }
}