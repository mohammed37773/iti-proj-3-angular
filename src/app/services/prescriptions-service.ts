import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPrescription } from '../models/iprescription';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionsService {
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/prescriptions';

  getAllPrescriptions(): Observable<IPrescription[]> {
    return this.http.get<IPrescription[]>(this.apiUrl);
  }

  createPrescription(prescription: IPrescription): Observable<IPrescription> {
    return this.http.post<IPrescription>(this.apiUrl, prescription);
  }

  getPrescriptionsByDoctor(doctorId: string): Observable<IPrescription[]> {
    return this.http.get<IPrescription[]>(`${this.apiUrl}?doctorId=${doctorId}`);
  }
}
