import { environment } from './../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IAppointment } from '../models/iappointment';
import { IUser } from '../models/iuser';
import { MedicalRecord } from '../models/imedical-record';

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  http = inject(HttpClient);

  private baseUrl = 'http://localhost:5000';

  // =========================
  // APPOINTMENTS
  // =========================

  getAppointments(patientId: string): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(
      `${environment.appointmentUrl}?patientId=${patientId}`
    );
  }

  bookAppointment(data: IAppointment): Observable<IAppointment> {
    return this.http.post<IAppointment>(
      environment.appointmentUrl,
      data
    );
  }

  cancelAppointment(id: string) {
    return this.http.delete(
      `${environment.appointmentUrl}/${id}`
    );
  }

  rescheduleAppointment(id: string, data: IAppointment) {
    return this.http.put(
      `${environment.appointmentUrl}/${id}`,
      data
    );
  }

  // =========================
  // PROFILE (FIXED)
  // =========================

  getProfile(id: string) {
  return this.http.get<IUser>(`${environment.UserUrl}/${id}`);
}

updateProfile(id: string, profile: IUser) {
  return this.http.put<IUser>(`${environment.UserUrl}/${id}`, profile);
}
  // =========================
  // MEDICAL
  // =========================

  getMedicalRecords() {
  return this.http.get<MedicalRecord[]>(
    `http://localhost:3000/medicalRecords`
  );
}

  // =========================
  // DOCTOR SEARCH
  // =========================

  getDoctor(name: string) {
    return this.http.get<any[]>(
      `${environment.UserUrl}?name_like=${name}`
    );
  }

getUsers() {
  return this.http.get<any[]>(`http://localhost:3000/users`);
}

  
}

