// REST API Gateway Helper for DevHub Express Backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem("devhub_token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    method: options.method || "GET",
    headers,
    credentials: "include",
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
};

export default fetchAPI;
