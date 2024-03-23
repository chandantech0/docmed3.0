import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemistProfileComponent } from './chemist-profile.component';

describe('ChemistProfileComponent', () => {
  let component: ChemistProfileComponent;
  let fixture: ComponentFixture<ChemistProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemistProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemistProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
