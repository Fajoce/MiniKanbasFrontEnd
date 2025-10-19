import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
private readonly API_URL = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/register`, user);
  }

login(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, user).pipe(
      tap((response) => {
        // Detecta token aunque venga con otro nombre
        const token = (response as any).token || (response as any).accessToken || (response as any).data?.token;
        if (token) {
          localStorage.setItem('token', token);
          console.log('Token guardado:', token);
        } else {
          console.warn('No se encontró token en la respuesta:', response);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
