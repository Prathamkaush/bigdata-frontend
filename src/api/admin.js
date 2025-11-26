import axios from "axios";

const api = axios.create({
  baseURL: "https://bigdata-backend-s33g.onrender.com",
});

api.interceptors.request.use((config) => {
  const key = localStorage.getItem("admin_api_key");
  if (key) {
    config.headers["x-api-key"] = key;
  }
  return config;
});

export const createUser = (payload) =>
  api.post("/v1/admin/create-user", payload);


export default api;
