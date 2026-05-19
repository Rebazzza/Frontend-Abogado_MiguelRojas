import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaDerechoDialogComponent } from './area-derecho-dialog.component';

describe('AreaDerechoDialogComponent', () => {
  let component: AreaDerechoDialogComponent;
  let fixture: ComponentFixture<AreaDerechoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaDerechoDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaDerechoDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
