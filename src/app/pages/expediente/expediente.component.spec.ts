import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteComponent } from './expediente.component';

describe('ExpedienteComponent', () => {
  let component: ExpedienteComponent;
  let fixture: ComponentFixture<ExpedienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedienteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpedienteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
