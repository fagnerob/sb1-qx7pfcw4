export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'worker' | 'supervisor' | 'safety_technician' | 'admin';
  department: string;
  employee_id: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentType {
  id: string;
  name: string;
  category: string;
  description: string | null;
  created_at: string;
}

export interface Equipment {
  id: string;
  type_id: string;
  user_id: string;
  serial_number: string | null;
  status: string;
  issue_date: string;
  expiration_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Inspection {
  id: string;
  equipment_id: string;
  user_id: string;
  condition: string;
  notes: string | null;
  inspection_date: string;
  created_at: string;
}

export interface Issue {
  id: string;
  equipment_id: string;
  reported_by: string;
  assigned_to: string | null;
  status: string;
  description: string;
  resolution: string | null;
  created_at: string;
  updated_at: string;
}