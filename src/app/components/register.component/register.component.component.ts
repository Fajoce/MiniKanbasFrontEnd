import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthServiceService } from '../../services/auth.service.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../models/user.model';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatIcon,
    MatOption,
    MatSelectModule 
  ],
  templateUrl: './register.component.component.html',
  styleUrls: ['./register.component.component.scss'],
})
export class RegisterComponentComponent {
  @Output() registerSuccess = new EventEmitter<void>();
  @Output() backToLogin = new EventEmitter<void>();
  hidePassword = true;
  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    rol: ['user'],
  });

  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;

    const user: User = {
      username: this.form.get('username')!.value!.trim(),
      password: this.form.get('password')!.value!,
      rol: this.form.get('rol')!.value!.trim() || 'user',
    };

    this.authService.register(user).subscribe({
      next: () => this.registerSuccess.emit(),
      error: (err) =>
        (this.errorMessage = err.error?.message || 'Error al registrar'),
    });
  }

 goBack() {
  this.router.navigate(['/login']);
}
}
