import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Infraction } from '../../../models/infraction';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-infraction-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, CdkDrag, MatButtonModule],
  template: `
    <mat-card class="inf-card" cdkDrag>
      <mat-card-title>{{ infraction.type }}</mat-card-title>
      <mat-card-subtitle>{{ infraction.driverName }} · {{ infraction.driverId }}</mat-card-subtitle>
      <mat-card-content>
        <div>Valor: {{ infraction.amount | currency:'COP' }}</div>
        <div *ngIf="infraction.dueDate">Vence: {{ infraction.dueDate | date:'short' }}</div>
      </mat-card-content>
      <mat-card-title>{{ infraction.officerName }}</mat-card-title>
      <mat-card-actions align="end">
        <button mat-icon-button (click)="edit.emit(infraction)"><mat-icon>edit</mat-icon></button>
        <button mat-icon-button (click)="delete.emit(infraction)"><mat-icon>delete</mat-icon></button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`.inf-card{ cursor: move; margin-bottom:6px; }`]
})
export class TaskCardComponent {
  @Input() infraction!: Infraction;
  @Output() edit = new EventEmitter<Infraction>();
  @Output() delete = new EventEmitter<Infraction>();
}
