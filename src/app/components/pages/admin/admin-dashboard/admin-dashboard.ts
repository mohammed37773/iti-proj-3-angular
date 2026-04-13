import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../services/patient';
import { AppointmentService } from '../../../../services/appointment';
import { AsyncPipe } from '@angular/common';
import { DoctorService } from '../../../../services/doctor-service';
import { forkJoin, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [AsyncPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
  ) {}
  data$!: Observable<{ doctors: number; patients: number; appointments: number }>;
  // doctorsCount$!: Observable<number>;
  // patientsCount$!: Observable<number>
  // appointmentsCount$!: Observable<number>;
  ngOnInit(): void {
    // this.doctorsCount$ = this.doctorService.getAllDoctors().pipe(map((d) => d.length));
    // this.patientsCount$ = this.patientService.getAllPatients().pipe(map((p) => p.length));
    // this.appointmentsCount$ = this.appointmentService.getAllAppointments().pipe(map((a) => a.length));
    this.data$ = forkJoin({
      doctors: this.doctorService.getAllDoctors().pipe(map((d) => d.length)),
      patients: this.patientService.getAllPatients().pipe(map((p) => p.length)),
      appointments: this.appointmentService.getAllAppointments().pipe(map((a) => a.length)),
    });
  }
}
