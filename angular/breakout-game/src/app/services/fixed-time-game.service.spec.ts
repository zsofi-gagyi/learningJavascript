import { TestBed } from '@angular/core/testing';

import { FixedTimeGameService } from './fixed-time-game.service';

describe('GameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FixedTimeGameService = TestBed.get(FixedTimeGameService);
    expect(service).toBeTruthy();
  });
});
