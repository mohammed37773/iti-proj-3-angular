import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IAppointment } from '../models/iappointment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsService {
  http = inject(HttpClient);
  private apiUrl = environment.appointmentUrl;

  getAllAppointments(): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(this.apiUrl);
  }

  updateAppointment(id: string, updates: Partial<IAppointment>): Observable<IAppointment> {
    return this.http.patch<IAppointment>(`${this.apiUrl}/${id}`, updates);
  }
}
