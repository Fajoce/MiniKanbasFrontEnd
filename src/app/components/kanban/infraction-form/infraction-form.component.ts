import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Infraction } from '../../../models/infraction';

@Component({
  selector: 'app-infraction-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ isEdit ? 'Editar Infracción' : 'Crear Infracción' }}
    </h2>

    <form [formGroup]="form" (ngSubmit)="save()" mat-dialog-content>
      <mat-form-field class="full">
        <mat-label>Nombre conductor</mat-label>
        <input matInput formControlName="driverName" />
        <mat-error *ngIf="form.controls['driverName'].hasError('required')"
          >Requerido</mat-error
        >
        <mat-error *ngIf="form.controls['driverName'].hasError('minlength')"
          >Mínimo 3 caracteres</mat-error
        >
      </mat-form-field>

      <mat-form-field class="full">
        <mat-label>Identificación</mat-label>
        <input matInput formControlName="driverId" />
      </mat-form-field>

       <mat-form-field class="full">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="type">
          <mat-option value="TYPE_A">Tipo A</mat-option>
          <mat-option value="TYPE_B">Tipo B</mat-option>
          <mat-option value="TYPE_C">Tipo C</mat-option>
          <mat-option value="TYPE_D">Tipo D</mat-option>
          <mat-option value="TYPE_E">Tipo E</mat-option>
        
        </mat-select>
      </mat-form-field>

      <mat-form-field class="full">
        <mat-label>Cantidad</mat-label>
        <input matInput type="number" formControlName="amount" />
      </mat-form-field>

      <mat-form-field class="full">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="status">
          <mat-option value="PENDING">Pendiente</mat-option>
          <mat-option value="IN_PROCESS">En progreso</mat-option>
          <mat-option value="PAID">Completado</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field class="full">
        <mat-label>Fecha vencimiento</mat-label>
        <input matInput type="datetime-local" formControlName="dueDate" />
      </mat-form-field>

      <mat-form-field class="full">
        <mat-label>Nombre del oficial</mat-label>
        <input matInput formControlName="officerName" />
      </mat-form-field>
      <mat-form-field class="full">
        <mat-label>Observaciones</mat-label>
        <input matInput formControlName="notes" />
      </mat-form-field>
    </form>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancelar</button>
      <button
        mat-flat-button
        color="primary"
        [disabled]="form.invalid"
        (click)="save()"
      >
        Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full {
        width: 100%;
      }
    `,
  ],
})
export class InfractionFormComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InfractionFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { status?: string; infraction?: Infraction }
  ) {
    this.form = this.fb.group({
      id: [],
      driverName: ['', [Validators.required, Validators.minLength(3)]],
      driverId: ['', Validators.required],
      type: ['', Validators.required],
      amount: [1, [Validators.required, Validators.min(1)]],
      status: ['PENDING', Validators.required],
      dueDate: [''],
      officerName: [''],
      notes: [''],
    });

    // ✅ Rellenar formulario si se está editando
    if (data?.infraction) {
      this.form.patchValue(data.infraction);
    } else if (data?.status) {
      this.form.patchValue({ status: data.status });
    }
  }

  get isEdit(): boolean {
    return !!this.form.value.id;
  }

  save(): void {
    const val = { ...this.form.value };

    // convertir fecha local a ISO si existe
    if (val.dueDate) {
      val.dueDate = new Date(val.dueDate).toISOString();
    }

    this.dialogRef.close(val as Infraction);
  }

  close(): void {
    this.dialogRef.close();
  }
}
