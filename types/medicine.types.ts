export interface HomeopathicMedicine {
  uid: string;
  name: string;
  power: string;
  expiration_date: string;
  is_available: boolean;
  manufacturer: string;
  total_quantity: number;
  unit_price: number;
  description: string;
  batch_number: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  organization: string;
}

export interface MedicineFilters {
  isAvailable: string;
  expirationDate: string;
  expirationOperator: "exact" | "gt" | "lt";
}

export interface MedicineStatistics {
  total: number;
  available: number;
  expired: number;
  expiringSoon: number;
}
