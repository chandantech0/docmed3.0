import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineCheckoutComponent } from './medicine-checkout.component';

describe('MedicineCheckoutComponent', () => {
  let component: MedicineCheckoutComponent;
  let fixture: ComponentFixture<MedicineCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicineCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
