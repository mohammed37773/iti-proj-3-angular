import { Component, inject, OnInit } from '@angular/core';
import { IDoctor } from '../../../../../models/idoctor';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../../../services/doctor-service';

@Component({
  selector: 'app-admin-edit-doctor',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-edit-doctor.html',
  styleUrl: './admin-edit-doctor.css',
})
export class AdminEditDoctor implements OnInit {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  doctorService = inject(DoctorService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?\d{11}$/)]],
  });
  isLoading = false;
  id!: string;
  data!: any;
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.data = this.doctorService.getDoctorById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue({
          fullName: data.name,
          email: data.email,
          phone: data.phone,
        });
      },
      error: (err) => {
        console.error('Failed to load doctor data:', err);
        alert('Failed to load doctor data. Please try again later.');
      },
    });
  }

  // initializeForm(data: IDoctor) {
  //   this.form = this.fb.group({
  //     fullName: [data.name, [Validators.required, Validators.minLength(3)]],
  //     email: [data.email, [Validators.required, Validators.email]],
  //     phone: [data.phone, [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
  //     bio: [data.bio],
  //     experience: [data.experience],
  //   });
  // }

  onSubmit() {
    this.isLoading = true;
    const updatedDoctor = {
      name: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone,
    };
    this.doctorService.updateDoctorPartial(this.id, updatedDoctor).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Doctor updated successfully!');
        this.router.navigate(['/doctors']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to update doctor:', err);
        alert('Failed to update doctor. Please try again later.');
      },
    });
  }
  onCancel() {
    if(confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')){
      this.router.navigate(['/doctors']);
    }
  }
}
