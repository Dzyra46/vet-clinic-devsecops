import { patients, type Patient } from '../models/Patient';

export class PatientService {
  // Get all patients
  static async getAll(): Promise<Patient[]> {
    return patients;
  }

  // Get patient by ID
  static async getById(id: string): Promise<Patient | undefined> {
    return patients.find(p => p.id === id);
  }

  // Create new patient
  static async create(data: Omit<Patient, 'id'>): Promise<Patient> {
    const newPatient: Patient = {
      ...data,
      id: `P-${String(patients.length + 1).padStart(3, '0')}`
    };
    
    patients.push(newPatient);
    return newPatient;
  }

  // Update patient
  static async update(id: string, data: Partial<Patient>): Promise<Patient | null> {
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return null;

    patients[index] = { ...patients[index], ...data };
    return patients[index];
  }

  // Delete patient
  static async delete(id: string): Promise<boolean> {
    const index = patients.findIndex(p => p.id === id);
    if (index === -1) return false;

    patients.splice(index, 1);
    return true;
  }

  // Search patients
  static async search(query: string): Promise<Patient[]> {
    const lowercaseQuery = query.toLowerCase();
    return patients.filter(p => 
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.owner.toLowerCase().includes(lowercaseQuery) ||
      p.species.toLowerCase().includes(lowercaseQuery) ||
      p.breed.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Filter by status
  static async filterByStatus(status: Patient['status']): Promise<Patient[]> {
    return patients.filter(p => p.status === status);
  }

  // Get patients by owner
  static async getByOwner(ownerName: string): Promise<Patient[]> {
    return patients.filter(p => p.owner.toLowerCase() === ownerName.toLowerCase());
  }
}
