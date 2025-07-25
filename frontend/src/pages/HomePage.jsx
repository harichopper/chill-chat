import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useSocketContext } from "../context/SocketContext";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { socket } = useSocketContext();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!socket || !authUser) return;

    const handleNewMessage = (message) => {
      // Don't show notification if message is from self or already chatting with the sender
      if (message.senderId === authUser._id || message.senderId === selectedUser?._id) return;

      toast.success(`💬 New message from ${message.senderName || "someone"}`);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, authUser, selectedUser]);

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
