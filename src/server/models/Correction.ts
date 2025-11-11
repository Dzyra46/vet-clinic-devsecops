export interface CorrectionRequest {
  id: string;
  recordId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  field: string;
  currentValue: string;
  proposedValue: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
}

// Mock database - will be replaced with Prisma
export const correctionRequests: CorrectionRequest[] = [
  {
    id: 'CR-001',
    recordId: 'REC-1205',
    patientId: 'P-001',
    patientName: 'Max',
    doctorName: 'Dr. Emily Watson',
    field: 'diagnosis',
    currentValue: 'Otitis externa (mild)',
    proposedValue: 'Otitis externa (moderate bacterial)',
    reason: 'Follow-up exam showed increased discharge and redness.',
    status: 'pending',
    createdAt: '2025-11-10T09:15:00Z'
  },
  {
    id: 'CR-002',
    recordId: 'REC-1190',
    patientId: 'P-003',
    patientName: 'Charlie',
    doctorName: 'Dr. Sarah Martinez',
    field: 'weight',
    currentValue: '32kg',
    proposedValue: '30.8kg',
    reason: 'Scale recalibration; previous measurement off.',
    status: 'approved',
    createdAt: '2025-11-09T14:20:00Z',
    decidedAt: '2025-11-09T16:05:00Z',
    decidedBy: 'Admin Jane'
  },
  {
    id: 'CR-003',
    recordId: 'REC-1182',
    patientId: 'P-002',
    patientName: 'Luna',
    doctorName: 'Dr. Michael Chen',
    field: 'medication',
    currentValue: 'Amoxicillin 250mg BID',
    proposedValue: 'Amoxicillin 200mg BID',
    reason: 'Weight correction reduces dosage requirement.',
    status: 'rejected',
    createdAt: '2025-11-08T11:02:00Z',
    decidedAt: '2025-11-08T12:30:00Z',
    decidedBy: 'Admin Jane'
  }
];
