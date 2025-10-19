import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthServiceService } from './services/auth.service.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" *ngIf="authService.isAuthenticated()">
      <span>Kanban App</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/kanban">Kanban</a>
      <a mat-button routerLink="/infractions">Infracciones</a>
      <button mat-button color="warn" (click)="logout()">Logout</button>
    </mat-toolbar>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    a { color: white; text-decoration: none; margin-left: 0.5rem; }
  `]
})
export class AppComponent {
  authService = inject(AuthServiceService);
  router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}