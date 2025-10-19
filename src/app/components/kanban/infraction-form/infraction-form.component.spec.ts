import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfractionFormComponent } from './infraction-form.component';

describe('InfractionFormComponent', () => {
  let component: InfractionFormComponent;
  let fixture: ComponentFixture<InfractionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfractionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfractionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
