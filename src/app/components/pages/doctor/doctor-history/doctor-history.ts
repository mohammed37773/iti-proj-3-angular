import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth-service';
import { AppointmentsService } from '../../../../services/appointments-service';
import { MedicalRecordsService } from '../../../../services/medical-records-service';
import { PrescriptionsService } from '../../../../services/prescriptions-service';
import { IAppointment, AppointmentStatus } from '../../../../models/iappointment';
import { IUser } from '../../../../models/iuser';
import { MedicalRecord } from '../../../../models/imedical-record';
import { IPrescription } from '../../../../models/iprescription';
import { environment } from '../../../../../environments/environment.development';

interface HistoryItem {
  appt: IAppointment;
  patientName: string;
  record?: MedicalRecord;
  prescription?: IPrescription;
}

@Component({
  selector: 'app-doctor-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-history.html',
  styleUrl: './doctor-history.css',
})
export class DoctorHistory implements OnInit {
  auth = inject(AuthService);
  appointmentsSvc = inject(AppointmentsService);
  recordsSvc = inject(MedicalRecordsService);
  prescSvc = inject(PrescriptionsService);
  http = inject(HttpClient);
  doctorId: string = '';
  historyItems: HistoryItem[] = [];
  isLoading = new BehaviorSubject(false);
  isLoading$ = this.isLoading.asObservable();
  error: string | null = null;

  ngOnInit() {
    const currentUser = this.auth.getCurrentUserData();
    if (!currentUser?.id || currentUser.role !== 'doctor') {
      this.error = 'Doctor session required.';
      this.isLoading.next(false);
      return;
    }
    this.doctorId = currentUser.id;
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading.next(true);
    forkJoin({
      users: this.http.get<IUser[]>(environment.UserUrl),
      appointments: this.appointmentsSvc.getAllAppointments(),
      records: this.recordsSvc.getAllMedicalRecords(),
      prescriptions: this.prescSvc.getAllPrescriptions()
    }).subscribe({
      next: ({ users, appointments, records, prescriptions }) => {
        this.historyItems = appointments
          .filter(appt => appt.doctorId === this.doctorId && appt.status === 'completed')
          .map(appt => ({
            appt,
            patientName: users.find(u => u.id === appt.patientId)?.name || 'Unknown',
            record: records.find(r => r.appointmentId === appt.id),
            prescription: prescriptions.find(p => p.appointmentId === appt.id)
          }));
        this.isLoading.next(false);
      },
      error: (err) => {
        console.error('Failed to load history:', err);
        this.error = 'Failed to load medical history.';
        this.isLoading.next(false);
      }
    });
  }
}
