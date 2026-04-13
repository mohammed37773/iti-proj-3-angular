import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IUser } from '../../../../models/iuser';
import { PatientService } from '../../../../services/patient';
import { IPatient } from '../../../../models/ipatient';

@Component({
  selector: 'app-admin-patients',
  imports: [],
  templateUrl: './admin-patients.html',
  styleUrl: './admin-patients.css',
})
export class AdminPatients implements OnInit {
  patients: IPatient[] = [];
  isLoading = true;

  constructor(private patientService: PatientService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading patients:', err);
        this.isLoading = false;
        alert('Failed to load patients. Please try again later.');
      },
    });
  }

  deactivatePatient(id: string) {
    if (confirm('Are you sure you want to deactivate this patient?')) {
      this.patientService.updatePatient(id, { deactivated: true }).subscribe({
        next: () => {
          alert('Patient deactivated successfully.');
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error deactivating patient:', err);
          alert('Failed to deactivate patient. Please try again later.');
        },
      })
    }
  }

    activatePatient(id: string) {
    if (confirm('Are you sure you want to activate this patient?')) {
      this.patientService.updatePatient(id, { deactivated: false }).subscribe({
        next: () => {
          alert('Patient activated successfully.');
          this.loadPatients();
        },
        error: (err) => {
          console.error('Error activating patient:', err);
          alert('Failed to activate patient. Please try again later.');
        },
      })
    }
  }
}
