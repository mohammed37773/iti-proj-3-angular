import { map, switchMap } from 'rxjs';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PatientService } from '../../../../services/patient';
import { DoctorService } from '../../../../services/doctor';
import { IAppointment } from '../../../../models/iappointment';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-appointments.html',
  styleUrl: './patient-appointments.css',
})
export class PatientAppointments implements OnInit {
  private appointmentService = inject(PatientService);
  private doctorService = inject(DoctorService);
  private cdr = inject(ChangeDetectorRef);

  appointments: (IAppointment & {
    doctorName?: string;
    specialization?: string;
    experience?: number;
  })[] = [];

  doctors: any[] = [];
  filteredDoctors: any[] = [];

  selectedDoctorId: string = '0';
  searchTerm: string = '';

  selectedSlot: any = null;
  selectedDoctor: any = null;

  get patientId(): string {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : '';
  }

  ngOnInit(): void {
    this.loadAppointments();
    this.loadDoctors();
  }

  loadAppointments() {
    this.appointmentService
      .getAppointments(this.patientId)
      .pipe(
        switchMap((apps: IAppointment[]) =>
          this.doctorService.getDoctors().pipe(
            map((docs: any[]) =>
              apps.map((app) => {
                const doctor = docs.find((d) => d.id == app.doctorId);

                return {
                  ...app,
                  doctorName: doctor?.name,
                  specialization: doctor?.specialization,
                  experience: doctor?.experience,
                };
              }),
            ),
          ),
        ),
      )
      .subscribe({
        next: (data: any) => (this.appointments = data),
        error: (err: any) => console.log(err),
      });
  }

  // =========================
  // 👨‍⚕️ LOAD DOCTORS
  // =========================
  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (docs: any) => {
        this.doctors = docs;
        this.filteredDoctors = docs;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.cdr.detectChanges();
      },
    });
  }

  // =========================
  // 🔍 SEARCH
  // =========================
  searchDoctors() {
    const term = this.searchTerm.toLowerCase();

    this.filteredDoctors = this.doctors.filter((d) => d.name.toLowerCase().includes(term));
  }

  // =========================
  // 👇 SELECT DOCTOR
  // =========================
  onDoctorChange() {
    this.selectedDoctor = this.doctors.find((d) => d.id == this.selectedDoctorId) || null;

    this.selectedSlot = null;
  }

  // =========================
  // 🕒 SELECT SLOT
  // =========================
  selectSlot(slot: any) {
    if (slot.isBooked) return;
    this.selectedSlot = slot;
  }

  // =========================
  // 📌 BOOK APPOINTMENT
  // =========================
  bookAppointment() {
    if (!this.selectedDoctorId || this.selectedDoctorId === '0') {
      alert('اختار دكتور الأول');
      return;
    }

    if (!this.selectedSlot) {
      alert('اختار ميعاد الأول');
      return;
    }

    const newAppointment: IAppointment = {
      patientId: this.patientId,
      doctorId: this.selectedDoctorId,
      date: this.selectedSlot.day,
      timeSlot: `${this.selectedSlot.startTime} - ${this.selectedSlot.endTime}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.appointmentService.bookAppointment(newAppointment).subscribe({
      next: (res: any) => {
        this.appointments.push({
          ...res,
          doctorName: this.doctors.find((d) => d.id == res.doctorId)?.name,
        });

        // mark slot as booked
        const doc = this.doctors.find((d) => d.id == this.selectedDoctorId);

        if (doc?.availableSlots) {
          const slot = doc.availableSlots.find(
            (s: any) =>
              s.startTime === this.selectedSlot.startTime && s.day === this.selectedSlot.day,
          );

          if (slot) slot.isBooked = true;
        }

        this.selectedSlot = null;
                this.cdr.detectChanges();

      },
      error: (err: any) => console.log(err),
    });
  }

  // =========================
  // ❌ CANCEL
  // =========================
  cancelAppointment(id: string) {
    this.appointmentService.cancelAppointment(id).subscribe({
      next: () => {
        this.appointments = this.appointments.filter((a) => a.id !== id);
      },
      error: (err: any) => console.log(err),
    });
  }

  // =========================
  // ✅ COMPLETE
  // =========================
  markCompleted(app: IAppointment) {
    const updated: IAppointment = {
      ...app,
      status: 'completed',
    };

    this.appointmentService.rescheduleAppointment(app.id!, updated).subscribe({
      next: () => {(app.status = 'completed'); this.cdr.detectChanges();},
      error: (err: any) => {
        console.log(err);
        this.cdr.detectChanges();
      },
    });
  }

  // =========================
  // ⭐ TRACK BY (Performance)
  // =========================
  trackByDoctorId(index: number, item: any) {
    return item.id;
  }

  trackBySlotId(index: number, item: any) {
    return item.id || index;
  }

  trackByAppointmentId(index: number, item: any) {
    return item.id;
  }

  // ⭐ Rating helpers
  getFullStars(rating: number): number {
    return Math.floor(rating);
  }

  getEmptyStars(rating: number): number {
    return 5 - Math.floor(rating);
  }
}
