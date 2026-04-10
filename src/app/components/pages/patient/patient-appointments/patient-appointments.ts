import { Component, inject, OnInit } from '@angular/core';
import { AppointmentService } from '../../../../services/appointment';
import { IAppointment } from '../../../../models/iappointment';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../../../../services/doctor';

@Component({
  selector: 'app-patient-appointments',
  templateUrl: './patient-appointments.html',
  styleUrl: './patient-appointments.css',
    imports: [CommonModule], // ✅ هنا الحل
})
export class PatientAppointments implements OnInit {

  appointmentService = inject(AppointmentService);

  doctorService = inject(DoctorService);
appointments: (IAppointment & { doctorName?: string })[] = [];


  patientId = JSON.parse(localStorage.getItem('user')!).id;

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
  this.appointmentService.getAppointmentsByPatient(this.patientId)
    .subscribe({
      next: (apps) => {

        this.doctorService.getDoctors().subscribe(docs => {

          this.appointments = apps.map(app => {
            const doctor = docs.find(d => d.id == app.doctorId);

            return {
              ...app,
              doctorName: doctor?.name
            };
          });

        });

      },
      error: (err) => console.log(err)
    });
}

  // 🔥 حجز
 bookAppointment() {
  const newAppointment: IAppointment = {
    patientId: this.patientId,
    doctorId: '2',
    date: '2026-04-15',
    timeSlot: '09:30 - 10:00',
    status: 'pending',
    createdAt: new Date().toISOString() // optional بس مهم
  };

  this.appointmentService.createAppointment(newAppointment)
    .subscribe(res => {
      this.appointments.push(res);
    });
}

   

  // ❌ إلغاء
  cancelAppointment(id: string) {
    this.appointmentService.deleteAppointment(id)
      .subscribe(() => {
        this.appointments = this.appointments.filter(a => a.id !== id);
      });
  }

  // 🔄 تغيير status
  markCompleted(app: IAppointment) {
    app.status = 'completed';

    this.appointmentService.updateAppointment(app)
      .subscribe();
  }
}