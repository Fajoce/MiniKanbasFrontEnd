import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfractionListComponentComponent } from './infraction-list-component.component';

describe('InfractionListComponentComponent', () => {
  let component: InfractionListComponentComponent;
  let fixture: ComponentFixture<InfractionListComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfractionListComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfractionListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
