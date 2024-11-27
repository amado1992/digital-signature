import { TestBed } from '@angular/core/testing';

import { PlanesByClientesService } from './planes-by-clientes.service';

describe('PlanesByClientesService', () => {
  let service: PlanesByClientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanesByClientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
