import { TestBed } from '@angular/core/testing';

import { ItemPackService } from './item-pack-service';

describe('ItemPackService', () => {
  let service: ItemPackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemPackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
