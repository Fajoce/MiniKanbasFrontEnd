export enum InfractionStatus {
  PENDING = 'PENDING',
  IN_PROCESS = 'IN_PROCESS',
  PAID = 'PAID'
}

export interface Infraction {
  id?: number;
  driverName: string;
  driverId: string;
  type: string;
  amount: number;
  status: InfractionStatus;
  issuedAt?: string; // ISO date
  dueDate?: string;  // ISO date
  officerName?: string;
  notes?: string;
}