export type UserRole = 'admin' | 'doctor' | 'pet-owner';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // In production, this will be hashed
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPublic {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

// Mock database - will be replaced with Prisma
export const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@vetclinic.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Dr. Emily Watson',
    email: 'doctor@vetclinic.com',
    password: 'doctor123',
    role: 'doctor',
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 3,
    name: 'John Doe',
    email: 'owner@example.com',
    password: 'owner123',
    role: 'pet-owner',
    createdAt: '2025-02-01T00:00:00Z'
  }
];
