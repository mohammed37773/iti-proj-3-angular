import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MedicalRecord } from '../models/imedical-record';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordsService {
  http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/medicalRecords';

  getAllMedicalRecords(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(this.apiUrl);
  }

  createMedicalRecord(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(this.apiUrl, record);
  }

  getMedicalRecordsByDoctor(doctorId: string): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${this.apiUrl}?doctorId=${doctorId}`);
  }
}
