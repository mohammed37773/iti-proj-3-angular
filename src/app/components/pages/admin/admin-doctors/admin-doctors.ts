import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../../services/doctor-service';
import { IDoctor } from '../../../../models/idoctor';
import { catchError, map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-doctors',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './admin-doctors.html',
  styleUrl: './admin-doctors.css',
})
export class AdminDoctors implements OnInit {
  doctors: IDoctor[] = [];
  isLoading = true;

  constructor(private doctorService: DoctorService, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
        this.isLoading = false;
        alert('Failed to load doctors. Please try again later.');
      },
    });
  }

  deleteDoctor(id: string) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.doctorService.deleteDoctor(id).subscribe({
        next: () => {
          this.loadDoctors();
          alert('Doctor deleted successfully.');
        },
        error: (err) => {
          console.error('Error deleting doctor:', err);
          alert('Failed to delete doctor. Please try again later.');
        },
      });
    }
  }

  // loadDoctors(): void {
  //   this.isLoading = true;
  //   this.doctorService.getAllDoctors().subscribe({
  //     next: (data) => {
  //       this.doctors = data;
  //       this.isLoading = false;
  //     },
  //     error: (err) => {
  //       console.error('Error loading doctors:', err);
  //       this.isLoading = false;
  //     },
  //   });
  // }

  // deleteDoctor(id: number): void {
  //   if (confirm('Are you sure you want to delete this doctor?')) {
  //     this.doctorService.deleteDoctor(id).subscribe({
  //       next: () => {
  //         this.doctors = this.doctors.filter((d) => d.id !== id);
  //       },
  //       error: (err) => console.error('Error deleting doctor:', err),
  //     });
  //   }
  // }
}
