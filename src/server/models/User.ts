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
