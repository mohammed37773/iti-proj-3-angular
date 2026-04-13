import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DoctorService } from '../../../../services/doctor-service';
import { IDoctor, ITimeSlot } from '../../../../models/idoctor';

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-details.html',
  styleUrl: './doctor-details.css',
})
export class DoctorDetails implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  doctorService = inject(DoctorService);
  http = inject(HttpClient);
  changeDetect = inject(ChangeDetectorRef)

  doctor: IDoctor | null = null;
  isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable()

  error: string | null = null;
  availableSlots: ITimeSlot[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDoctor(id);
    } else {
      this.error = 'Doctor ID not found';
    }
  }

  loadDoctor(id: string) {
    this.isLoading.next(true);
    this.error = null;
    this.doctorService.getDoctorById(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (doctor) => {
        this.doctor = doctor;
        console.log(doctor);
        this.availableSlots = doctor.availableSlots?.filter(slot => !slot.isBooked) || [];
        this.isLoading.next(false);
        console.log(this.isLoading);
      },
      error: (err) => {
        console.error('Failed to load doctor:', err);
        this.error = 'Doctor not found';
        this.isLoading.next(false);
      }
    });
  }

  bookSlot(slot: ITimeSlot) {
    // TODO: Implement full booking (requires login, create appointment)
    console.log('Booking slot:', slot);
    alert(`Book appointment with Dr. ${this.doctor?.name} on ${slot.day} ${slot.startTime}-${slot.endTime}\n(Full implementation requires login)`);
  }

  goBack() {
    this.router.navigate(['/doctors']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
