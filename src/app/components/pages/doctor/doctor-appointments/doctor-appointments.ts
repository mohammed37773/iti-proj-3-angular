import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth-service';
import { AppointmentsService } from '../../../../services/appointments-service';
import { AppointmentStatus, IAppointment } from '../../../../models/iappointment';
import { IUser } from '../../../../models/iuser';
import { environment } from '../../../../../environments/environment';

interface ExtendedAppointment extends IAppointment {
  patientName: string;
}

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-appointments.html',
  styleUrl: './doctor-appointments.css',
})
export class DoctorAppointments implements OnInit {
  auth = inject(AuthService);
  appointmentsSvc = inject(AppointmentsService);
  http = inject(HttpClient);
  doctorId: string = '';
  doctorAppointments: ExtendedAppointment[] = [];
  isLoading = new BehaviorSubject(false);
  isLoading$ = this.isLoading.asObservable()
  error: string | null = null;

  ngOnInit() {
    const currentUser = this.auth.getCurrentUserData();
    if (!currentUser?.id) {
      this.error = 'No doctor session. Please login.';
      this.isLoading.next(false);
      return;
    }
    this.doctorId = currentUser.id;
    this.loadAppointments();
  }

  loadAppointments() {
    forkJoin({
      appointments: this.appointmentsSvc.getAllAppointments(),
      users: this.http.get<IUser[]>(environment.UserUrl)
    }).subscribe({
      next: ({ appointments, users }: { appointments: IAppointment[]; users: IUser[] }) => {
        this.doctorAppointments = appointments
          .filter((appt: IAppointment) => appt.doctorId === this.doctorId)
          .map((appt: IAppointment) => ({
            ...appt,
            patientName: users.find((user) => user.id === appt.patientId)?.name || 'Unknown'
          })) as ExtendedAppointment[];
      this.isLoading.next(false);
      },
      error: (err) => {
        console.error('Failed to load appointments:', err);
        this.error = 'Failed to load appointments';
      this.isLoading.next(false);
      }
    });
  }

  updateStatus(id: string, status: AppointmentStatus) {
    this.appointmentsSvc.updateAppointment(id!, { status }).subscribe({
      next: () => {
        this.loadAppointments(); // refresh list
      },
      error: (err) => {
        console.error('Update status failed:', err);
        alert('Failed to update status');
      }
    });
  }
}
