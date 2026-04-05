import { IPrescription } from "./iprescription";

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  prescription?: IPrescription;
  notes: string;
  date: string;
}
