import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const url = "https://ahead-chats-backend.onrender.com";
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(url); // server URL
    setSocket(newSocket);
    console.log(`✅ New socket created: ${newSocket.id} for ${user.name}`);
    newSocket.emit("setup", user);

    newSocket.on("get-online-users", (users) => {
      setOnlineUsers(users); // Track online user IDs
    });

    return () => {
      console.log(`🛑 Disconnecting socket: ${newSocket.id}`);
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        url,
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        socket,
        onlineUsers,
        setSocket,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// custom hook function to simplify using useContext(ChatContext) in every comp
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
