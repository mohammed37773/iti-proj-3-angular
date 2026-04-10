import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/users';

  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?role=doctor`);
  }

  getDoctorById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}