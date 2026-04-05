export interface IPrescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medications: IMedication[];
  diagnosis: string;
  notes?: string;
  createdAt: string;
}

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}
