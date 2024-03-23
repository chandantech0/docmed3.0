import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacedOrdersListComponent } from './placed-orders-list.component';

describe('PlacedOrdersListComponent', () => {
  let component: PlacedOrdersListComponent;
  let fixture: ComponentFixture<PlacedOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacedOrdersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacedOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
