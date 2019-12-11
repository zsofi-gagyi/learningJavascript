import { TestBed } from '@angular/core/testing';

import { IntersectionDetectorService } from './intersection-detector.service';

describe('IntersectionDetectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IntersectionDetectorService = TestBed.get(IntersectionDetectorService);
    expect(service).toBeTruthy();
  });
});
