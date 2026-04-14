import { IUser } from './../../../../models/iuser';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { PatientService } from '../../../../services/patient';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})
export class PatientProfile implements OnInit {
  private patientService = inject(PatientService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  UserProfile: IUser | null = null;
  loading = true;

  isEditMode = false;

  editModel: IUser = {} as IUser;

  get patientId(): string {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user).id : '';
  }

  ngOnInit(): void {
    const id = this.patientId;

    console.log('ID:', id);

    if (id) {
      this.getPatientDetails(id);
    }
  }

  getPatientDetails(id: string) {
    this.loading = true;

    this.patientService.getProfile(id).subscribe({
      next: (res) => {
        console.log('API:', res);

        this.UserProfile = res as IUser;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  openEdit() {
    this.isEditMode = true;
    this.editModel = { ...this.UserProfile! };
  }

  cancelEdit() {
    this.isEditMode = false;
  }

  saveUpdate() {
    if (!this.patientId) {
      console.log('No ID found');
      return;
    }

    this.patientService.updateProfile(this.patientId, this.editModel).subscribe({
      next: (res) => {
        this.UserProfile = res;
        this.isEditMode = false;
      },
      error: (err) => console.log(err),
    });
  }
}
