const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function for making requests
const request = async (endpoint: string, method: string, data?: any) => {
  // Check if the data is FormData
  const isFormData = data instanceof FormData;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: isFormData ? {} : { "Content-Type": "application/json" },
    body: isFormData ? data : data ? JSON.stringify(data) : undefined,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.detail || "Something went wrong.");
  }

  return json;
};

// POST request
export const postData = async (endpoint: string, data: any) => {
  return request(endpoint, "POST", data);
};

// GET request
export const getData = async (endpoint: string) => {
  return request(endpoint, "GET");
};

// PUT request (for updates data)
export const putData = async (endpoint: string, data: any) => {
  return request(endpoint, "PUT", data);
};

// DELETE request
export const deleteData = async (endpoint: string) => {
  return request(endpoint, "DELETE");
};
