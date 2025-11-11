export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

// Mock database - will be replaced with Prisma
export const doctors: Doctor[] = [
  {
    id: 'D-001',
    name: 'Dr. Emily Watson',
    email: 'emily.watson@vetclinic.com',
    specialization: 'Small Animal Surgery',
    licenseNumber: 'VET-2024-001',
    phone: '+62 812-3456-7890',
    status: 'active',
    joinDate: '2024-01-15'
  },
  {
    id: 'D-002',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@vetclinic.com',
    specialization: 'Internal Medicine',
    licenseNumber: 'VET-2024-002',
    phone: '+62 813-9876-5432',
    status: 'active',
    joinDate: '2024-02-01'
  },
  {
    id: 'D-003',
    name: 'Dr. Sarah Martinez',
    email: 'sarah.martinez@vetclinic.com',
    specialization: 'Dermatology',
    licenseNumber: 'VET-2024-003',
    phone: '+62 821-5555-6666',
    status: 'active',
    joinDate: '2024-03-10'
  },
  {
    id: 'D-004',
    name: 'Dr. James Wilson',
    email: 'james.wilson@vetclinic.com',
    specialization: 'Emergency Care',
    licenseNumber: 'VET-2023-045',
    phone: '+62 822-7777-8888',
    status: 'inactive',
    joinDate: '2023-08-20'
  }
];
