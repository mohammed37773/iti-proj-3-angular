import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPrescriptions } from './doctor-prescriptions';

describe('DoctorPrescriptions', () => {
  let component: DoctorPrescriptions;
  let fixture: ComponentFixture<DoctorPrescriptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorPrescriptions],
    }).compileComponents();

    fixture = TestBed.createComponent(DoctorPrescriptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
