import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppointment } from '../models/iappointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  http = inject(HttpClient);
  baseUrl = 'http://localhost:3000/appointments';

  // GET by patient
  getAppointmentsByPatient(patientId: string): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(`${this.baseUrl}?patientId=${patientId}`);
  }

  // POST
  createAppointment(app: IAppointment): Observable<IAppointment> {
    return this.http.post<IAppointment>(this.baseUrl, app);
  }

  // DELETE
  deleteAppointment(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // PUT (update)
  updateAppointment(app: IAppointment) {
    return this.http.put(`${this.baseUrl}/${app.id}`, app);
  }
}