import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "http://localhost:5001/api"
      : "/api", // Use the full backend URL for production
  withCredentials: true,
});
