import { TestBed } from '@angular/core/testing';

import { VariableTimeGameService } from './variable-time-game.service';

describe('ComplexGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VariableTimeGameService = TestBed.get(VariableTimeGameService);
    expect(service).toBeTruthy();
  });
});
