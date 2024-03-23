import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemistListComponent } from './chemist-list.component';

describe('ChemistListComponent', () => {
  let component: ChemistListComponent;
  let fixture: ComponentFixture<ChemistListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemistListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemistListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
