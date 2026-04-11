import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DoctorService } from '../../../../services/doctor-service';
import { AuthService } from '../../../../services/auth-service';
import { IDoctor } from '../../../../models/idoctor';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './doctors.html',
  styleUrl: './doctors.css',
})
export class Doctors implements OnInit {
  fb = inject(FormBuilder);
  doctorService = inject(DoctorService);
  router = inject(Router);
  http = inject(HttpClient);
  auth = inject(AuthService);

  doctors: IDoctor[] = [];
  filteredDoctors: IDoctor[] = [];
  isLoading = false;
  filterForm!: FormGroup;

  ngOnInit() {
    this.filterForm = this.fb.group({
      name: [''],
      specialization: ['']
    });

    this.loadDoctors();

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  loadDoctors() {
    this.isLoading = true;
    this.doctorService.getAllDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
        this.filteredDoctors = doctors;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    console.log("filtering");
    
    const nameFilter = this.filterForm.get('name')?.value?.toLowerCase() || '';
    const specFilter = this.filterForm.get('specialization')?.value?.toLowerCase() || '';

    this.filteredDoctors = this.doctors.filter(doctor =>
      (nameFilter === '' || doctor.name.toLowerCase().includes(nameFilter)) &&
      (specFilter === '' || doctor.specialization?.toLowerCase().includes(specFilter))
    );
  }

  viewDoctor(id: string) {   
    this.router.navigate(['/doctors', id]);
  }
}
