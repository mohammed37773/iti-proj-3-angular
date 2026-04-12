import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth-service';
import { AppointmentsService } from '../../../../services/appointments-service';
import { PrescriptionsService } from '../../../../services/prescriptions-service';
import { IAppointment } from '../../../../models/iappointment';
import { IUser } from '../../../../models/iuser';
import { IPrescription, IMedication } from '../../../../models/iprescription';
import { environment } from '../../../../../environments/environment.development';

interface ExtendedPrescription extends IPrescription {
  patientName?: string;
}

@Component({
  selector: 'app-doctor-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctor-prescriptions.html',
  styleUrl: './doctor-prescriptions.css',
})
export class DoctorPrescriptions implements OnInit {
  auth = inject(AuthService);
  appointmentsSvc = inject(AppointmentsService);
  prescSvc = inject(PrescriptionsService);
  http = inject(HttpClient);
  doctorId = '';
  prescriptions: ExtendedPrescription[] = [];
  patients: IUser[] = [];
  appointments: IAppointment[] = [];
  isLoading = new BehaviorSubject(false);
  isLoading$ = this.isLoading.asObservable();
  error: string | null = null;

  // Form
  newPrescription: IPrescription = {
    id: '',
    appointmentId: '',
    patientId: '',
    doctorId: '',
    medications: [],
    diagnosis: '',
    notes: '',
    createdAt: new Date().toISOString()
  };
  newMed: Partial<IMedication> = { name: '', dosage: '', frequency: '', duration: '' };

  ngOnInit() {
    const currentUser = this.auth.getCurrentUserData();
    if (!currentUser?.id || currentUser.role !== 'doctor') {
      this.error = 'Doctor session required.';
      return;
    }
    this.doctorId = currentUser.id;
    this.newPrescription.doctorId = this.doctorId;
    this.loadData();
  }

  onPatientChange() {
    // Optional: filter appointments for selected patient
  }

  loadData() {
    this.isLoading.next(true);
    forkJoin({
      users: this.http.get<IUser[]>(environment.UserUrl),
      appointments: this.appointmentsSvc.getAllAppointments(),
      prescriptions: this.prescSvc.getAllPrescriptions()
    }).subscribe({
      next: ({ users, appointments, prescriptions: allPresc }) => {
        this.patients = users.filter(u => u.role === 'patient');
        this.appointments = appointments.filter(a => a.doctorId === this.doctorId && a.status === 'completed');
        this.prescriptions = allPresc
          .filter(p => p.doctorId === this.doctorId)
          .map(p => ({
            ...p,
            patientName: users.find(u => u.id === p.patientId)?.name || 'Unknown'
          }));
        this.isLoading.next(false);
      },
      error: (err) => {
        console.error('Failed to load:', err);
        this.error = 'Failed to load data.';
        this.isLoading.next(false);
      }
    });
  }

  addMedication() {
    if (this.newMed.name && this.newMed.dosage && this.newMed.frequency && this.newMed.duration) {
      this.newPrescription.medications!.push(this.newMed as IMedication);
      this.newMed = { name: '', dosage: '', frequency: '', duration: '' };
    }
  }

  removeMedication(index: number) {
    this.newPrescription.medications.splice(index, 1);
  }

  createPrescription() {
    if (!this.newPrescription.appointmentId || !this.newPrescription.diagnosis || this.newPrescription.medications!.length === 0) {
      alert('Please fill appointment, diagnosis, and at least one medication.');
      return;
    }
    this.prescSvc.createPrescription(this.newPrescription).subscribe({
      next: () => {
        this.loadData();
        this.resetForm();
        alert('Prescription created!');
      },
      error: (err) => {
        console.error('Create failed:', err);
        alert('Failed to create prescription.');
      }
    });
  }

  resetForm() {
    this.newPrescription = {
      id: '',
      appointmentId: '',
      patientId: '',
      doctorId: this.doctorId,
      medications: [],
      diagnosis: '',
      notes: '',
      createdAt: new Date().toISOString()
    };
    this.newMed = { name: '', dosage: '', frequency: '', duration: '' };
  }
}
