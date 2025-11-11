import { correctionRequests, type CorrectionRequest } from '../models/Correction';

export class CorrectionService {
  // Get all correction requests
  static async getAll(): Promise<CorrectionRequest[]> {
    return correctionRequests;
  }

  // Get by ID
  static async getById(id: string): Promise<CorrectionRequest | undefined> {
    return correctionRequests.find(c => c.id === id);
  }

  // Get by status
  static async getByStatus(status: CorrectionRequest['status']): Promise<CorrectionRequest[]> {
    return correctionRequests.filter(c => c.status === status);
  }

  // Get by doctor
  static async getByDoctor(doctorName: string): Promise<CorrectionRequest[]> {
    return correctionRequests.filter(c => c.doctorName === doctorName);
  }

  // Create new correction request
  static async create(data: Omit<CorrectionRequest, 'id' | 'status' | 'createdAt'>): Promise<CorrectionRequest> {
    const newRequest: CorrectionRequest = {
      ...data,
      id: `CR-${String(correctionRequests.length + 1).padStart(3, '0')}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    correctionRequests.push(newRequest);
    return newRequest;
  }

  // Approve correction
  static async approve(id: string, decidedBy: string): Promise<CorrectionRequest | null> {
    const index = correctionRequests.findIndex(c => c.id === id);
    if (index === -1) return null;

    correctionRequests[index] = {
      ...correctionRequests[index],
      status: 'approved',
      decidedAt: new Date().toISOString(),
      decidedBy
    };

    return correctionRequests[index];
  }

  // Reject correction
  static async reject(id: string, decidedBy: string): Promise<CorrectionRequest | null> {
    const index = correctionRequests.findIndex(c => c.id === id);
    if (index === -1) return null;

    correctionRequests[index] = {
      ...correctionRequests[index],
      status: 'rejected',
      decidedAt: new Date().toISOString(),
      decidedBy
    };

    return correctionRequests[index];
  }

  // Search corrections
  static async search(query: string): Promise<CorrectionRequest[]> {
    const lowercaseQuery = query.toLowerCase();
    return correctionRequests.filter(c => 
      c.patientName.toLowerCase().includes(lowercaseQuery) ||
      c.patientId.toLowerCase().includes(lowercaseQuery) ||
      c.recordId.toLowerCase().includes(lowercaseQuery) ||
      c.field.toLowerCase().includes(lowercaseQuery)
    );
  }
}
