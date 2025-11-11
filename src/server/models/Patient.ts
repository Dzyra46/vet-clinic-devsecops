export interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  owner: string;
  contact: string;
  lastVisit: string;
  status: 'healthy' | 'under-treatment' | 'recovered';
  medicalCondition?: string;
}

// Mock database - will be replaced with Prisma
export const patients: Patient[] = [
  {
    id: 'P-001',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 5,
    weight: 32,
    owner: 'John Doe',
    contact: '+62 812-1111-2222',
    lastVisit: '2025-11-05',
    status: 'healthy',
    medicalCondition: 'Annual checkup completed'
  },
  {
    id: 'P-002',
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: 3,
    weight: 4.5,
    owner: 'Jane Smith',
    contact: '+62 813-3333-4444',
    lastVisit: '2025-11-08',
    status: 'under-treatment',
    medicalCondition: 'Upper respiratory infection'
  },
  {
    id: 'P-003',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Labrador',
    age: 7,
    weight: 30,
    owner: 'Mike Johnson',
    contact: '+62 821-5555-6666',
    lastVisit: '2025-10-28',
    status: 'recovered',
    medicalCondition: 'Post-surgery recovery'
  }
];
