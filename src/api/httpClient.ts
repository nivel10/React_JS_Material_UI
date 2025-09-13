import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || " http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;