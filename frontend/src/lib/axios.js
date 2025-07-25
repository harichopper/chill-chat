import axios from "axios";

const BACKEND_URLS = {
  local: "http://localhost:5001/api",
  render: "https://chill-chat-9do2.onrender.com/api",
  vercel: "https://chill-chat-cyan.vercel.app/api" // ✅ Active backend
};

// Logic to pick the correct backend URL
const getBaseURL = () => {
  if (import.meta.env.MODE === "development") return BACKEND_URLS.local;

  // ✅ Use Vercel backend in production
  return BACKEND_URLS.vercel;
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // ✅ Send cookies for auth
});
