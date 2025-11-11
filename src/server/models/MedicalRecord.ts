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

// Mock database - will be replaced with Prisma
export const medicalRecords: MedicalRecord[] = [
  {
    id: 'REC-1205',
    patientId: 'P-001',
    patientName: 'Max',
    date: '2025-11-05',
    doctorName: 'Dr. Emily Watson',
    diagnosis: 'Routine checkup - Healthy',
    treatment: 'Vaccination updated',
    medication: 'None',
    notes: 'Annual wellness exam. All vitals normal.',
    nextVisit: '2026-11-05'
  },
  {
    id: 'REC-1190',
    patientId: 'P-002',
    patientName: 'Luna',
    date: '2025-11-08',
    doctorName: 'Dr. Michael Chen',
    diagnosis: 'Upper Respiratory Infection',
    treatment: 'Antibiotics prescribed',
    medication: 'Amoxicillin 50mg BID for 7 days',
    notes: 'Mild URI. Monitor for improvement in 3 days.',
    nextVisit: '2025-11-15'
  }
];
