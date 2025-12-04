export const COLORS = {
  navy: "#205072",
  navyLight: "#2d6a96",
  navyLighter: "#3a84ba",
  navyDark: "#183d56",
  navyDarker: "#0f2a3b",
  cyan: "#2ab7ca",
  cyanLight: "#4dc4d4",
  cyanLighter: "#70d1de",
  cyanDark: "#2199aa",
  cyanDarker: "#187b8a",
} as const;

export const EXPIRATION_OPERATORS = {
  exact: "on",
  gt: "after",
  lt: "before",
} as const;

export const SORT_OPTIONS = [
  { value: "created_at", label: "Date Added" },
  { value: "name", label: "Name" },
  { value: "expiration_date", label: "Expiration Date" },
  { value: "unit_price", label: "Price" },
  { value: "total_quantity", label: "Quantity" },
] as const;
