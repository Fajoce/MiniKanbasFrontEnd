import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfractionCardComponent } from './infraction-card.component';

describe('InfractionCardComponent', () => {
  let component: InfractionCardComponent;
  let fixture: ComponentFixture<InfractionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfractionCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfractionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
