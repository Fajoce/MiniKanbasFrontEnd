import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Infraction } from '../models/infraction';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InfractionService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Infraction[]> {
    return this.http.get<Infraction[]>(this.base).pipe(catchError(this.handle));
  }

  getByStatus(status: string) {
    return this.http.get<Infraction[]>(`${this.base}/status/${encodeURIComponent(status)}`).pipe(catchError(this.handle));
  }

  create(inf: Infraction) {
    return this.http.post<Infraction>(this.base, inf).pipe(catchError(this.handle));
  }

  update(id: number, partial: Partial<Infraction>) {
    return this.http.put<Infraction>(`${this.base}/${id}`, partial).pipe(catchError(this.handle));
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`).pipe(catchError(this.handle));
  }

  private handle(err: any) {
    console.error(err);
    return throwError(() => err);
  }
}
