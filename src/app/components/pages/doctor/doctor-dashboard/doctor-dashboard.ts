import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth-service';
import { AppointmentsService } from '../../../../services/appointments-service';
import { IAppointment } from '../../../../models/iappointment';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit {
  auth = inject(AuthService);
  apptsService = inject(AppointmentsService);
  appointments = signal<IAppointment[]>([]);
  todayAppts = signal(0);
  upcomingAppts = signal(0);
  totalPatients = signal(0);
  recentPatients = signal<any[]>([]);
  doctorId: string = '';
  userName: string = '';

  ngOnInit() {
const user: any = this.auth.getCurrentUserData();
    this.doctorId = user?.id || '';
    this.userName = user.name || 'Doctor';
    this.loadAppointments();
  }

  loadAppointments() {
    this.apptsService.getAllAppointments().subscribe({
      next: (appts: IAppointment[]) => {
        const myAppts = appts.filter(a => a.doctorId === this.doctorId);
        this.appointments.set(myAppts);
        this.updateStats();
      },
      error: (err: any) => console.error('Failed to load appointments', err)
    });
  }

  private updateStats() {
    const appts = this.appointments();
    const today = new Date().toISOString().split('T')[0];
    this.todayAppts.set(appts.filter(a => a.date === today).length);
    const upcoming = appts.filter(a => a.date > today && ['pending', 'confirmed'].includes(a.status || '')).length;
    this.upcomingAppts.set(upcoming);
    const patients = new Set(appts.map(a => a.patientId));
    this.totalPatients.set(patients.size);

    // Recent patients
    const sortedAppts = [...appts].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    const recentMap = new Map<string, any>();
    for (const appt of sortedAppts) {
      if (!recentMap.has(appt.patientId)) {
        recentMap.set(appt.patientId, {
          patientId: appt.patientId,
          lastDate: appt.date,
          status: appt.status,
          apptId: appt.id
        });
      }
      if (recentMap.size === 5) break;
    }
    this.recentPatients.set(Array.from(recentMap.values()));
  }
}
