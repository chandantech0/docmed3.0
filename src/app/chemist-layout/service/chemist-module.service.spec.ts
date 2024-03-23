import { TestBed } from '@angular/core/testing';

import { ChemistModuleService } from './chemist-module.service';

describe('ChemistModuleService', () => {
  let service: ChemistModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChemistModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
