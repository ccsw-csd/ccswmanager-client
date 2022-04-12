import { TestBed } from '@angular/core/testing';

import { PyramidTeamService } from './pyramid-team.service';

describe('PyramidTeamsService', () => {
  let service: PyramidTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PyramidTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
