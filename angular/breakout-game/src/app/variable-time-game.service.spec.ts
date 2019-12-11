import { TestBed } from '@angular/core/testing';

import { ComplexGameService } from './complex-game.service';

describe('ComplexGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComplexGameService = TestBed.get(ComplexGameService);
    expect(service).toBeTruthy();
  });
});
