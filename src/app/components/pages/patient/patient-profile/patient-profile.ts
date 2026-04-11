import { IUser } from './../../../../models/iuser';
import { Component, inject, OnInit } from '@angular/core';
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

  UserProfile: IUser | null = null;
  loading = true;

  isEditMode = false;

  editModel: IUser = {} as IUser;

  
 get patientId(): string {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).id : '';
}

ngOnInit(): void {
  const id = this.patientId;

  console.log('ID:', id);

  if (id) {
    this.getPatientDetails(id);
  }
}

  // 🚀 GET PROFILE
getPatientDetails(id: string) {
  this.loading = true;

  this.patientService.getProfile(id)
    .subscribe({
      next: (res) => {
        console.log('API:', res);

        this.UserProfile = res as IUser;
        this.loading = false; // 👈 مهم جدًا
      },
      error: (err) => {
        console.log(err);
        this.loading = false; // 👈 لازم هنا كمان
      }
    });
}

  // ✏️ OPEN EDIT FORM
  openEdit() {
    this.isEditMode = true;
    this.editModel = { ...this.UserProfile! };
  }

  // ❌ CANCEL EDIT
  cancelEdit() {
    this.isEditMode = false;
  }

  // 💾 SAVE UPDATE
  saveUpdate() {
 

  if (!this.patientId) {
    console.log('No ID found');
    return;
  }

  this.patientService.updateProfile(this.patientId, this.editModel)
    .subscribe({
      next: (res) => {
        this.UserProfile = res;
        this.isEditMode = false;
      },
      error: (err) => console.log(err)
    });
}
  }

