import { createContext , useContext, useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const ChatContext = createContext()

const ChatProvider = ({children}) =>{

  const url = "https://ahead-chats-backend.onrender.com";
   const [user , setUser ] =  useState();
   const [selectedChat , setSelectedChat] = useState();
   const [chats ,setChats] = useState([]);
   const[notification,setNotification] = useState([]);
   const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);

   const navigate = useNavigate();

    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
        if(!userInfo){
            navigate("/");
        }
    },[navigate])

    useEffect(() => {
        if (!user) return;
      
        const newSocket = io("http://localhost:8000"); // your server URL
        setSocket(newSocket);
      
        newSocket.emit("setup", user);
      
        newSocket.on("get-online-users", (users) => {
          setOnlineUsers(users); // 👥 Track online user IDs
        });
      
        return () => {
          newSocket.disconnect();
        };
      }, [user]);
      
    
    return (
        <ChatContext.Provider value ={{url ,user , setUser , selectedChat , setSelectedChat ,chats ,setChats ,notification,setNotification ,socket,
            onlineUsers }}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState = () =>{
   return  useContext(ChatContext);
}


export default ChatProvider;
