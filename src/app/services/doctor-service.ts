import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth-service';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/iuser';
import { environment } from '../../environments/environment';
import { ObservableInput } from 'rxjs';
import { IDoctor, ITimeSlot } from '../models/idoctor';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  auth = inject(AuthService);
  http = inject(HttpClient);

  getAppointments(email: string, password: string) {
    return this.http.get<IUser[]>(environment.UserUrl + `?email=${email}&password=${password}`);
  }
  createNewSlot(timeSlot: ITimeSlot) {
    let user = this.auth.getCurrentUserData();
    this.http.post(environment.UserUrl + `?id=${user.id}/availableSlots`, timeSlot).subscribe({
      next: () => {
        // todo: add observable
      },
      error: (err) => {
        console.error('Failed to create time slot:', err);
      },
    });
  }

  getAllDoctors() {
    return this.http.get<IDoctor[]>(environment.UserUrl + '?role=doctor');
  }
}
