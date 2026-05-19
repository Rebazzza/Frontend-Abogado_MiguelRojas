import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienciaDialogComponent } from './audiencia-dialog.component';

describe('AudienciaDialogComponent', () => {
  let component: AudienciaDialogComponent;
  let fixture: ComponentFixture<AudienciaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienciaDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AudienciaDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
