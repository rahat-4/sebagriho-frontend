// Convert full name string to { first_name, last_name }
export const splitFullNameToParts = (
  fullName: string
): { firstName: string; lastName: string } => {
  const parts = fullName.trim().split(/\s+/);
  const [firstName, ...rest] = parts;
  const lastName = rest.join(" ");
  return { firstName, lastName };
};

// Convert { first_name, last_name } to full name string
export const combineNamePartsToFullName = (params: {
  first_name: string;
  last_name?: string;
}): string => {
  const { first_name, last_name } = params;
  return [first_name, last_name].filter(Boolean).join(" ");
};
