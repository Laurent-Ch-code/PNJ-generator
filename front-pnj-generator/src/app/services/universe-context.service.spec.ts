import { TestBed } from '@angular/core/testing';

import { UniverseContextService } from './universe-context.service';

describe('UniverseContextService', () => {
  let service: UniverseContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniverseContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
