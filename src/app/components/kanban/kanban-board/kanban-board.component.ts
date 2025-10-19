import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfractionService } from '../../../services/infraction.service.service';
import { Infraction, InfractionStatus } from '../../../models/infraction';
import { CdkDragDrop, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskCardComponent } from '../infraction-card/infraction-card.component';
import { InfractionFormComponent } from '../infraction-form/infraction-form.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-kanban-board',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    TaskCardComponent,
    InfractionFormComponent
  ],
  template: `
  <div class="board">
    <div class="column" *ngFor="let col of columns">
      <h3>{{ col.label }}</h3>
      <div cdkDropList
           [id]="col.key"
           [cdkDropListData]="col.tasks"
           [cdkDropListConnectedTo]="connectedLists"
           (cdkDropListDropped)="drop($event, col.key)"
           class="task-list">
        <ng-container *ngFor="let t of col.tasks">
          <app-infraction-card [infraction]="t" (edit)="openEdit($event)" (delete)="delete($event)"></app-infraction-card>
        </ng-container>
      </div>
      <button mat-mini-fab color="primary" (click)="openCreate(col.key)" aria-label="Add">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  </div>
  `,
  styles: [`
    .board { display:flex; gap:16px; padding:16px; height: calc(100vh - 64px); box-sizing: border-box; }
    .column { flex:1; background:#f5f5f5; border-radius:8px; padding:12px; position:relative; display:flex; flex-direction:column; }
    .task-list { flex:1; overflow:auto; min-height:60px; padding:8px; display:flex; flex-direction:column; gap:8px; }
    h3 { margin:0 0 8px; display:flex; justify-content:space-between; align-items:center; }
    button[mat-mini-fab]{ position:absolute; bottom:12px; right:12px; }
  `]
})
export class KanbanBoardComponent implements OnInit {
  private svc = inject(InfractionService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  columns = [
    { key: 'PENDING' as InfractionStatus, label: 'Pendiente', tasks: [] as Infraction[] },
    { key: 'IN_PROCESS' as InfractionStatus, label: 'En progreso', tasks: [] as Infraction[] },
    { key: 'PAID' as InfractionStatus, label: 'Inputado', tasks: [] as Infraction[] }
  ];

  connectedLists: string[] = [];

  ngOnInit() {
    this.loadAll();
    this.connectedLists = this.columns.map(c => c.key); // necesario para drag & drop
  }

  loadAll() {
    this.svc.getAll().pipe(take(1)).subscribe({
      next: list => {
        this.columns.forEach(c => c.tasks = []);
        for (const i of list) {
          const col = this.columns.find(c => c.key === i.status) ?? this.columns[0];
          col.tasks.push(i);
        }
      },
      error: () => this.snack.open('Error cargando infracciones', 'Cerrar', { duration: 4000 })
    });
  }

  openCreate(status: InfractionStatus) {
    const ref = this.dialog.open(InfractionFormComponent, { data: { status } });
    ref.afterClosed().pipe(take(1)).subscribe((res: Infraction | undefined) => {
      if (res) {
        res.status = (res.status || status) as InfractionStatus;
        this.svc.create(res).pipe(take(1)).subscribe({
          next: () => { this.snack.open('Infracción creada', 'OK', { duration:2000 }); this.loadAll(); },
          error: () => this.snack.open('Error creando', 'Cerrar', { duration:3000 })
        });
      }
    });
  }

  openEdit(inf: Infraction) {
    const ref = this.dialog.open(InfractionFormComponent, { data: { infraction: inf } });
    ref.afterClosed().pipe(take(1)).subscribe((res: Infraction | undefined) => {
      if (res && res.id) {
        this.svc.update(res.id, res).pipe(take(1)).subscribe({
          next: () => { this.snack.open('Infracción actualizada','OK',{duration:2000}); this.loadAll(); },
          error: () => this.snack.open('Error actualizando','Cerrar',{duration:3000})
        });
      }
    });
  }

  delete(inf: Infraction) {
    if (!inf.id) return;
    this.svc.delete(inf.id).pipe(take(1)).subscribe({
      next: () => { this.snack.open('Infracción eliminada','OK',{duration:2000}); this.loadAll(); },
      error: () => this.snack.open('Error eliminando','Cerrar',{duration:3000})
    });
  }

  drop(event: CdkDragDrop<Infraction[]>, toStatus: InfractionStatus) {
  if (event.previousContainer === event.container) return;

  const prev = event.previousContainer.data as Infraction[];
  const curr = event.container.data as Infraction[];
  const moved = prev[event.previousIndex];

  if (!moved) return;

  // Actualizar status en memoria antes de transferir
  moved.status = toStatus;

  // Transferir item al nuevo array
  transferArrayItem(prev, curr, event.previousIndex, event.currentIndex);

  // Actualizar en backend
  if (moved.id) {
    this.svc.update(moved.id, moved).pipe(take(1)).subscribe({
      next: () => this.snack.open('Estado actualizado', 'OK', { duration: 1500 }),
      error: () => {
        this.snack.open('Error actualizando estado', 'Cerrar', { duration: 3000 });
        this.loadAll(); // revertir cambios si falla
      }
    });
  }
  }
}
