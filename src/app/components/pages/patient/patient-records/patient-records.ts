import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';

import { PatientService } from '../../../../services/patient';
import { MedicalRecord } from '../../../../models/imedical-record';

@Component({
  selector: 'app-patient-records',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-records.html',
  styleUrl: './patient-records.css',
})
export class PatientRecords implements OnInit {

  private patientService = inject(PatientService);
  private cdr:ChangeDetectorRef = inject(ChangeDetectorRef);

  medcalRecordPatent: any[] = [];
  doctors: any[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    forkJoin({
      records: this.patientService.getMedicalRecords(),
      users: this.patientService.getUsers()
    }).subscribe({
      next: (res) => {

        this.medcalRecordPatent = res.records;
        this.doctors = res.users;

        // Map doctor name into each record
        this.medcalRecordPatent.forEach(record => {
          const doctor = this.doctors.find(d => d.id === record.doctorId);
          record.doctorName = doctor ? doctor.name : 'Unknown Doctor';

          this.cdr.detectChanges();
        });

        console.log('Final Records:', this.medcalRecordPatent);
      },
      error: (err) => {
        console.log('Error loading data:', err);
      }
    });
  }
}