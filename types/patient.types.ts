export interface Patient {
  uid: string;
  serial_number: string;
  old_serial_number?: string;
  first_name?: string;
  last_name?: string;
  name: string;
  avatar?: string;
  address?: string;
  phone: string;
  gender?: string;
  age?: string;
  blood_group?: string;
  relative_phone?: string;
  case_history?: string;
  presentCause?: string;
  miasm_type?: string;
  habits?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  uid: string;
  created_at: string;
  symptoms: string;
  treatment_effectiveness?: string;
  appointment_files?: string[] | null;
  medicines: string[];
}

export interface PatientFilters {
  miasm: string;
  bloodGroup: string;
  gender: string;
}

export interface PatientStatistics {
  total: number;
  todayVisited: number;
  recentPatients: number;
}
