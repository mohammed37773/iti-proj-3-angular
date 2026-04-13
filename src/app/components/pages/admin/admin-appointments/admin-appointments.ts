import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IAppointment } from '../../../../models/iappointment';
import { AppointmentService } from '../../../../services/appointment';
import { forkJoin } from 'rxjs';
import { IPatient } from '../../../../models/ipatient';
import { DoctorService } from '../../../../services/doctor';
import { PatientService } from '../../../../services/patient';
import { environment } from '../../../../../environments/environment.development';
import { IDoctor } from '../../../../models/idoctor';
import { Title } from '@angular/platform-browser';
import { LowerCasePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-admin-appointments',
  imports: [TitleCasePipe, LowerCasePipe],
  templateUrl: './admin-appointments.html',
  styleUrl: './admin-appointments.css',
})
export class AdminAppointments implements OnInit {
  appointments: any[] = [];
  isLoading = true;
  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    forkJoin({
      appointments: this.appointmentService.getAllAppointments(),
      patients: this.patientService.getAllPatients(),
      doctors: this.doctorService.getDoctors(),
    }).subscribe({
      next: ({
        appointments,
        patients,
        doctors,
      }: {
        appointments: IAppointment[];
        patients: IPatient[];
        doctors: IDoctor[];
      }) => {
        this.appointments = appointments.map((appt: IAppointment) => ({
          ...appt,
          patientName: patients.find((patient) => patient.id === appt.patientId)?.name || 'Unknown',
          doctorName: doctors.find((doctor) => doctor.id === appt.doctorId)?.name || 'Unknown',
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load appointments:', err);
        alert('Failed to load appointments. Please try again later.');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
