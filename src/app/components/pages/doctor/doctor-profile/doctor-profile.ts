import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth-service';
import { DoctorService } from '../../../../services/doctor-service';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IDoctor } from '../../../../models/idoctor';

@Component({
  selector: 'app-doctor-profile',
  imports: [JsonPipe, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile implements OnInit {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  doctorService = inject(DoctorService);
  router = inject(Router);
  form!: FormGroup;
  isLoading = false
  data = this.auth.getCurrentUserData() as IDoctor
  
  ngOnInit(): void {
    this.form = this.fb.group(
      {
        fullName: [this.data.name, [Validators.required, Validators.minLength(3)]],
        email: [this.data.email, [Validators.required, Validators.email]],
        phone: [this.data.phone, [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
        bio: [this.data.bio],
        experience: [this.data.experience],
        specialization: [this.data.specialization],
      },
    );
  }

  onSubmit(){
    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }

    const doctorData: Partial<IDoctor> = {
      ...this.form.value,
      name: this.form.value.fullName
    };

    this.doctorService.updateDoctor(this.data.id!, doctorData).subscribe({
      next: (updatedDoctor: IDoctor) => {
        this.auth.Authorize(updatedDoctor);
        this.form.patchValue({
          fullName: updatedDoctor.name,
          email: updatedDoctor.email,
          phone: updatedDoctor.phone,
          bio: updatedDoctor.bio ?? '',
          experience: updatedDoctor.experience,
          specialization: updatedDoctor.specialization
        });
        this.isLoading = false;
        alert('Profile updated successfully!');
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.isLoading = false;
        alert('Failed to update profile. Please try again.');
      }
    });
  }
}