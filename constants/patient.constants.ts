export const MIASM_OPTIONS = [
  { value: "ACUTE", label: "Acute" },
  { value: "TYPHOID", label: "Typhoid" },
  { value: "MALARIAL", label: "Malarial" },
  { value: "RINGWORM", label: "Ringworm" },
  { value: "PSORIC", label: "Psoric" },
  { value: "SYCOTIC", label: "Sycotic" },
  { value: "CANCER", label: "Cancer" },
  { value: "TUBERCULAR", label: "Tubercular" },
  { value: "LEPROSY", label: "Leprosy" },
  { value: "SYPHILITIC", label: "Syphilitic" },
  { value: "AIDS", label: "AIDS" },
] as const;

export const BLOOD_GROUP_OPTIONS = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
] as const;

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
] as const;

export const SORT_OPTIONS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "recent", label: "Recently Added" },
  { value: "serial", label: "Serial Number" },
] as const;
