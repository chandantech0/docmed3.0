import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemistDashboardComponent } from './chemist-dashboard.component';

describe('ChemistDashboardComponent', () => {
  let component: ChemistDashboardComponent;
  let fixture: ComponentFixture<ChemistDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemistDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemistDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
