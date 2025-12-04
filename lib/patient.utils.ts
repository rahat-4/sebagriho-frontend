import { Patient, PatientStatistics } from "@/types/patient.types";

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const formatPhoneNumber = (phone: string): string => {
  // Format phone number if needed
  return phone;
};

export const calculatePatientStatistics = (
  patients: Patient[]
): PatientStatistics => {
  const total = patients.length;
  const todayVisited = 0; // This should come from appointments API
  const recentPatients = patients.filter(
    (p) =>
      p.updated_at.includes("day") ||
      p.updated_at.includes("week") ||
      isRecentDate(p.updated_at)
  ).length;

  return { total, todayVisited, recentPatients };
};

export const isRecentDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysDiff <= 7;
};

export const sortPatients = (
  patients: Patient[],
  sortBy: string
): Patient[] => {
  const sorted = [...patients];

  switch (sortBy) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "recent":
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case "serial":
      return sorted.sort(
        (a, b) =>
          Number.parseInt(a.serial_number) - Number.parseInt(b.serial_number)
      );
    default:
      return sorted;
  }
};

export const filterPatients = (
  patients: Patient[],
  searchTerm: string,
  filters: { miasm: string; bloodGroup: string; gender: string }
): Patient[] => {
  return patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.serial_number.includes(searchTerm) ||
      patient.old_serial_number?.includes(searchTerm);

    const matchesMiasm =
      filters.miasm === "all" ||
      patient.miasm_type?.toLowerCase() === filters.miasm.toLowerCase();

    const matchesBloodGroup =
      filters.bloodGroup === "all" ||
      patient.blood_group?.toLowerCase() === filters.bloodGroup.toLowerCase();

    const matchesGender =
      filters.gender === "all" ||
      patient.gender?.toLowerCase() === filters.gender.toLowerCase();

    return matchesSearch && matchesMiasm && matchesBloodGroup && matchesGender;
  });
};
