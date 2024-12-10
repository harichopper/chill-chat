import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "https://chill-chat-9do2.onrender.com/api", // Use the full backend URL for production
  withCredentials: true,
});
