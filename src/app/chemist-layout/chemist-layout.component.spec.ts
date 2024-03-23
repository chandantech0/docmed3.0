import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemistLayoutComponent } from './chemist-layout.component';

describe('ChemistLayoutComponent', () => {
  let component: ChemistLayoutComponent;
  let fixture: ComponentFixture<ChemistLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemistLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemistLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
