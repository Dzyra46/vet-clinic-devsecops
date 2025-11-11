import { doctors, type Doctor } from '../models/Doctor';

export class DoctorService {
  // Get all doctors
  static async getAll(): Promise<Doctor[]> {
    return doctors;
  }

  // Get doctor by ID
  static async getById(id: string): Promise<Doctor | undefined> {
    return doctors.find(d => d.id === id);
  }

  // Create new doctor
  static async create(data: Omit<Doctor, 'id' | 'joinDate'>): Promise<Doctor> {
    const newDoctor: Doctor = {
      ...data,
      id: `D-${String(doctors.length + 1).padStart(3, '0')}`,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    doctors.push(newDoctor);
    return newDoctor;
  }

  // Update doctor
  static async update(id: string, data: Partial<Doctor>): Promise<Doctor | null> {
    const index = doctors.findIndex(d => d.id === id);
    if (index === -1) return null;

    doctors[index] = { ...doctors[index], ...data };
    return doctors[index];
  }

  // Delete doctor
  static async delete(id: string): Promise<boolean> {
    const index = doctors.findIndex(d => d.id === id);
    if (index === -1) return false;

    doctors.splice(index, 1);
    return true;
  }

  // Search doctors
  static async search(query: string): Promise<Doctor[]> {
    const lowercaseQuery = query.toLowerCase();
    return doctors.filter(d => 
      d.name.toLowerCase().includes(lowercaseQuery) ||
      d.email.toLowerCase().includes(lowercaseQuery) ||
      d.specialization.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Filter by status
  static async filterByStatus(status: 'active' | 'inactive'): Promise<Doctor[]> {
    return doctors.filter(d => d.status === status);
  }
}
