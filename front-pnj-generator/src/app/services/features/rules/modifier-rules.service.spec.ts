import { TestBed } from '@angular/core/testing';

import { ModifierRulesService } from './modifier-rules.service';

describe('ModifierRulesService', () => {
  let service: ModifierRulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModifierRulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
