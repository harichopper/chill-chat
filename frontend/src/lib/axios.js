import axios from "axios";

const BACKEND_URLS = {
  local: "http://localhost:5001/api",
  render: "https://chill-chat-9do2.onrender.com/api",
  vercel: "https://chill-chat-cyan.vercel.app/api"
};

// Logic to pick the correct backend URL
const getBaseURL = () => {
  if (import.meta.env.MODE === "development") return BACKEND_URLS.local;

  // You can also add custom logic here if needed
  // For now, default to render URL in production
  return BACKEND_URLS.render;
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // Include cookies in requests
});
