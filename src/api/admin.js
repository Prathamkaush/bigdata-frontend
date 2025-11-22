import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const key = localStorage.getItem("admin_api_key");
  if (key) {
    config.headers["x-api-key"] = key;
  }
  return config;
});

export default api;
