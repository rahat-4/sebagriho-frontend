// Convert single camelCase string to snake_case
export const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

// Convert object keys from camelCase to snake_case
export const convertKeysToSnakeCase = (
  obj: Record<string, any>
): Record<string, any> => {
  const converted: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = camelToSnake(key);
    converted[snakeKey] = value;
  }

  return converted;
};

// Convert single snake_case string to camelCase
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Convert object keys from snake_case to camelCase
export const convertKeysToCamelCase = (
  obj: Record<string, any>
): Record<string, any> => {
  const converted: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    converted[camelKey] = value;
  }

  return converted;
};
