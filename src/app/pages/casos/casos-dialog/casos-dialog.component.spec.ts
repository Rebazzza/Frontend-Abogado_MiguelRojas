import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosDialogComponent } from './casos-dialog.component';

describe('CasosDialogComponent', () => {
  let component: CasosDialogComponent;
  let fixture: ComponentFixture<CasosDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
