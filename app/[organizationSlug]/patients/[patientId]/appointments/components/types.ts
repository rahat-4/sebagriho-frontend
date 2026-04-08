// types/appointment.ts
export interface Medicine {
  uid: string;
  name: string;
  power?: string;
}

export interface Appointment {
  uid: string;
  symptoms: string;
  treatment_effectiveness?: string;
  appointment_file?: string;
  medicines: Medicine[];
  created_at: string;
  updated_at: string;
  status?: "active" | "completed" | "cancelled";
}

export interface Patient {
  name: string;
  serial_number?: string;
  old_serial_number?: string;
  phone?: string;
  image?: string;
}
