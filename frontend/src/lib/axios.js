import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://chill-chat-9do2.onrender.com/api"  // Correct production URL
      : "http://localhost:5001/api",  // Local development URL
  withCredentials: true,  // Include credentials for cross-origin requests
});
