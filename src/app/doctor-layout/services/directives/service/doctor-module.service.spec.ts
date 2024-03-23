import { TestBed } from '@angular/core/testing';

import { DoctorModuleService } from './doctor-module.service';

describe('DoctorModuleService', () => {
  let service: DoctorModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
