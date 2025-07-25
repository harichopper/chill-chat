  import Navbar from "./components/Navbar";
  import HomePage from "./pages/HomePage";
  import SignUpPage from "./pages/SignUpPage";
  import LoginPage from "./pages/LoginPage";
  import SettingsPage from "./pages/SettingsPage";
  import ProfilePage from "./pages/ProfilePage";

  import { Routes, Route, Navigate } from "react-router-dom";
  import { useAuthStore } from "./store/useAuthStore";
  import { useThemeStore } from "./store/useThemeStore";

  import { useEffect } from "react";
  import { Loader } from "lucide-react";
  import { Toaster, toast } from "react-hot-toast";
  import { connectSocket } from "./lib/socket";

  const App = () => {
    const { authUser, checkAuth, isCheckingAuth, setOnlineUsers } = useAuthStore();
    const { theme } = useThemeStore();

    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    useEffect(() => {
      if (authUser?._id) {
        const socket = connectSocket(authUser._id);

        socket.on("connect", () => {
          console.log("Socket connected:", socket.id);
        });

        socket.on("getOnlineUsers", (users) => {
          console.log("Online users:", users);
          setOnlineUsers(users); // Optional: Update global store
        });

        socket.on("receiveNotification", ({ type, message }) => {
          toast.success(`${type.toUpperCase()}: ${message}`);
        });

        return () => {
          socket.disconnect();
        };
      }
    }, [authUser]);

    if (isCheckingAuth && !authUser)
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
      );

    return (
      <div data-theme={theme}>
        <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
        <Toaster position="top-right" />
      </div>
    );
  };

  export default App;

