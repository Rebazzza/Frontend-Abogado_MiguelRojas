import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioLegalDialogComponent } from './servicio-legal-dialog.component';

describe('ServicioLegalDialogComponent', () => {
  let component: ServicioLegalDialogComponent;
  let fixture: ComponentFixture<ServicioLegalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioLegalDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicioLegalDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
