import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Infraction, InfractionStatus } from '../../models/infraction';
import { InfractionService } from '../../services/infraction.service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-infraction-list-component',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './infraction-list-component.component.html',
  styleUrl: './infraction-list-component.component.scss'
})
export class InfractionListComponentComponent {
displayedColumns: string[] = [
    'id', 'driverName', 'driverId', 'type', 'amount', 'status', 'issuedAt', 'dueDate', 'officerName', 'notes'
  ];

  dataSource = new MatTableDataSource<Infraction>([]);
  filterValue = '';
  statusFilter: InfractionStatus | '' = '';

  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private infractionService: InfractionService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.infractionService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

applyFilter(): void {
  this.dataSource.filterPredicate = (data: Infraction, filter: string) => {
    const filterObj = JSON.parse(filter); // decodificamos el objeto
    const textFilter = filterObj.text.toLowerCase();
    const statusFilter = filterObj.status;

    const statusMatch = statusFilter ? data.status === statusFilter : true;

    const textMatch =
      data.driverName.toLowerCase().includes(textFilter) ||
      data.driverId.toLowerCase().includes(textFilter) ||
      data.type.toLowerCase().includes(textFilter) ||
      (data.officerName?.toLowerCase().includes(textFilter) ?? false);

    return statusMatch && textMatch;
  };

  const filter = {
    text: this.filterValue.trim(),
    status: this.statusFilter
  };

  this.dataSource.filter = JSON.stringify(filter);
}

  clearFilters(): void {
    this.filterValue = '';
    this.statusFilter = '';
    this.applyFilter();
  }
}

