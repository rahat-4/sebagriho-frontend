import {
  HomeopathicMedicine,
  MedicineStatistics,
} from "@/types/medicine.types";

export const isExpired = (date: string): boolean => {
  return new Date(date) < new Date();
};

export const isExpiringSoon = (date: string): boolean => {
  const expirationDate = new Date(date);
  const today = new Date();
  const thirtyDaysFromNow = new Date(
    today.getTime() + 30 * 24 * 60 * 60 * 1000
  );
  return expirationDate <= thirtyDaysFromNow && expirationDate >= today;
};

export const getExpirationStatus = (
  expirationDate: string
): "expired" | "expiring_soon" | "valid" => {
  if (isExpired(expirationDate)) return "expired";
  if (isExpiringSoon(expirationDate)) return "expiring_soon";
  return "valid";
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateStatistics = (
  medicines: HomeopathicMedicine[]
): MedicineStatistics => {
  const total = medicines.length;
  const available = medicines.filter((med) => med.is_available).length;
  const expired = medicines.filter((med) =>
    isExpired(med.expiration_date)
  ).length;
  const expiringSoon = medicines.filter(
    (med) =>
      isExpiringSoon(med.expiration_date) && !isExpired(med.expiration_date)
  ).length;

  return { total, available, expired, expiringSoon };
};
