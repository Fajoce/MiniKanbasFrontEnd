import { TestBed } from '@angular/core/testing';
import { InfractionService } from './infraction.service.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Infraction, InfractionStatus } from '../models/infraction';
import { environment } from '../../environments/environment';

describe('InfractionService', () => {
  let service: InfractionService;
  let httpMock: HttpTestingController;

  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InfractionService]
    });

    service = TestBed.inject(InfractionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // asegura que no queden solicitudes pendientes
  });

  it('should fetch all infractions', () => {
    const dummyInfractions: Infraction[] = [
      { id: 1, driverName: 'John', driverId: 'D001', type: 'TYPE_A', amount: 100, status: InfractionStatus.PENDING },
      { id: 2, driverName: 'Jane', driverId: 'D002', type: 'TYPE_B', amount: 200, status: InfractionStatus.PAID }
    ];

    service.getAll().subscribe(data => {
      expect(data.length).toBe(2);
      expect(data).toEqual(dummyInfractions);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyInfractions);
  });

  it('should fetch infractions by status', () => {
    const dummy: Infraction[] = [
      { id: 1, driverName: 'John', driverId: 'D001', type: 'TYPE_A', amount: 100, status: InfractionStatus.PENDING }
    ];

    service.getByStatus(InfractionStatus.PENDING).subscribe(data => {
      expect(data.length).toBe(1);
      expect(data[0].status).toBe(InfractionStatus.PENDING);
    });

    const req = httpMock.expectOne(`${baseUrl}/status/PENDING`);
    expect(req.request.method).toBe('GET');
    req.flush(dummy);
  });

  it('should create an infraction', () => {
    const newInfraction: Infraction = { driverName: 'Mike', driverId: 'D003', type: 'TYPE_C', amount: 150, status: InfractionStatus.PENDING };

    service.create(newInfraction).subscribe(data => {
      expect(data.driverName).toBe('Mike');
      expect(data.id).toBeDefined();
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ ...newInfraction, id: 3 });
  });

  it('should update an infraction', () => {
    const update: Partial<Infraction> = { amount: 250 };

    service.update(1, update).subscribe(data => {
      expect(data.amount).toBe(250);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ id: 1, driverName: 'John', driverId: 'D001', type: 'TYPE_A', amount: 250, status: InfractionStatus.PENDING });
  });

  it('should delete an infraction', () => {
    service.delete(1).subscribe(res => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});