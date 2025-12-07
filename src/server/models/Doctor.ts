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
