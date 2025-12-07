export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  medication: string;
  notes: string;
  nextVisit?: string;
  blockchainHash?: string; // For future blockchain integration
}
