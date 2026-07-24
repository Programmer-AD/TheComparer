import { TestBed } from '@angular/core/testing';

import { ComparisonSessionService } from './comparison-session-service';

describe('ComparisonSessionService', () => {
  let service: ComparisonSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComparisonSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
