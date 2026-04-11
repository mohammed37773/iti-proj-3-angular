import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  getDoctors(): Observable<any[]> {
  return this.http.get<any[]>(environment.UserUrl);
}

  getDoctorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}