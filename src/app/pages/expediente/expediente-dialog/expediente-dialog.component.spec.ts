import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteDialogComponent } from './expediente-dialog.component';

describe('ExpedienteDialogComponent', () => {
  let component: ExpedienteDialogComponent;
  let fixture: ComponentFixture<ExpedienteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedienteDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpedienteDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
