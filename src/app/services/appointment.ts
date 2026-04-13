import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppointment } from '../models/iappointment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  http = inject(HttpClient);

  // ✅ GET by patient
  getAppointmentsByPatient(patientId: string): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(
      `${environment.appointmentUrl}?patientId=${patientId}`
    );
  }

  // ✅ POST
  createAppointment(app: IAppointment): Observable<IAppointment> {
    return this.http.post<IAppointment>(environment.appointmentUrl, app);
  }

  // ✅ DELETE
  deleteAppointment(id: string) {
    return this.http.delete(`${environment.appointmentUrl}/${id}`);
  }

  // ✅ PUT
  updateAppointment(app: IAppointment) {
    return this.http.put(`${environment.appointmentUrl}/${app.id}`, app);
  }

  // ✅ GET by doctor
  getAppointmentsByDoctor(doctorId: string): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(
      `${environment.appointmentUrl}?doctorId=${doctorId}`
    );
  }

  // ✅ GET all appointments  
  getAllAppointments(): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(environment.appointmentUrl);
  }
}