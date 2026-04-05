import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { isPatientGuard } from './is-patient-guard';

describe('isPatientGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isPatientGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
