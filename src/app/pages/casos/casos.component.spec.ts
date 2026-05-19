import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosComponent } from './casos.component';

describe('CasosComponent', () => {
  let component: CasosComponent;
  let fixture: ComponentFixture<CasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CasosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
