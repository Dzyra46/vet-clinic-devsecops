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
