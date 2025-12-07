// Database types - akan kita generate otomatis nanti
// Untuk sekarang, buat manual based on schema Anda

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'doctor' | 'pet-owner';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      patients: {
        Row: {
          id: string;
          name: string;
          species: string;
          breed: string;
          age: number;
          weight: number;
          owner_id: string;
          owner_name: string;
          owner_contact: string;
          last_visit: string;
          status: 'healthy' | 'under-treatment' | 'recovered';
          medical_condition?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['patients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['patients']['Insert']>;
      };
      // ... tambahkan types lainnya
    };
  };
};