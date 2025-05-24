// Convert full name string to { first_name, last_name }
export const splitFullNameToParts = (
  fullName: string
): { first_name: string; last_name: string } => {
  const parts = fullName.trim().split(/\s+/);
  const [first_name, ...rest] = parts;
  const last_name = rest.join(" ");
  return { first_name, last_name };
};

// Convert { first_name, last_name } to full name string
export const combineNamePartsToFullName = (params: {
  first_name: string;
  last_name?: string;
}): string => {
  const { first_name, last_name } = params;
  return [first_name, last_name].filter(Boolean).join(" ");
};
