const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Custom error class for API errors
export class APIError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.errors = errors;
  }
}

// Helper function for making requests
const request = async (endpoint: string, method: string, data?: any) => {
  try {
    // Check if the data is FormData
    const isFormData = data instanceof FormData;

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
      credentials: "include", // Include cookies for authentication
    });

    console.log("API------------------------- Request:", res);

    let json;

    // Handle cases where response might not be JSON
    try {
      json = await res.json();
    } catch (parseError) {
      // If response is not JSON, return empty object
      json = {};
    }

    // Return both status and data for consistent handling
    return [res.status, json];
  } catch (error) {
    // Network or other fetch errors
    console.error("API Request Error:", error);
    throw new APIError(
      error instanceof Error ? error.message : "Network error occurred",
      0
    );
  }
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

// PATCH request (for partial updates)
export const patchData = async (endpoint: string, data: any) => {
  return request(endpoint, "PATCH", data);
};

// DELETE request
export const deleteData = async (endpoint: string) => {
  return request(endpoint, "DELETE");
};

// Utility function to check if response was successful
export const isSuccess = (status: number): boolean => {
  return status >= 200 && status < 300;
};

// Utility function to handle API responses consistently
export const handleAPIResponse = async <T>(
  apiCall: () => Promise<[number, any]>
): Promise<{
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
  message?: string;
}> => {
  try {
    const [status, response] = await apiCall();

    if (isSuccess(status)) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        errors: response,
        message: response?.message || response?.detail || "Request failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    };
  }
};
