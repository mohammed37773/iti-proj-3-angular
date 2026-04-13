import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IUser } from '../../../../models/iuser';
import { PatientService } from '../../../../services/patient';

@Component({
  selector: 'app-admin-patients',
  imports: [],
  templateUrl: './admin-patients.html',
  styleUrl: './admin-patients.css',
})
export class AdminPatients implements OnInit {
  patients: IUser[] = [];
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

  // deactivatePatient(id: string) {
  //   if (confirm('Are you sure you want to deactivate this patient?')) {
  //     this.patientService.(id).subscribe({
  //       next: () => {
  //         this.loadPatients();
  //         alert('Patient deactivated successfully.');
  //       },
  //       error: (err) => {
  //         console.error('Error deactivating patient:', err);
  //         alert('Failed to deactivate patient. Please try again later.');
  //       },
  //     });
  //   }
  // }
}
