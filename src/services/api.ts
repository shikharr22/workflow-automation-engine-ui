import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Relative path enables proxy to work
  headers: {
    "Content-Type": "application/json",
  },
});

// Utility to get headers with token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// GET request with auth
export const getWithAuth = async <T>(url: string): Promise<T> => {
  const response = await api.get<T>(url, getAuthHeaders());
  return response.data;
};

// POST request with auth
export const postWithAuth = async <T, D = unknown>(
  url: string,
  data?: D
): Promise<T> => {
  const response = await api.post<T>(url, data, getAuthHeaders());
  return response.data;
};

export default api;
