import { TestBed } from '@angular/core/testing';

import { SimpleGameService } from './game.service';

describe('GameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimpleGameService = TestBed.get(SimpleGameService);
    expect(service).toBeTruthy();
  });
});
