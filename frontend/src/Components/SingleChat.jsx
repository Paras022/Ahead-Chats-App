import React, { useRef ,useEffect, useState ,useCallback } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, Spinner, Text, FormControl, Input } from "@chakra-ui/react";
import { IconButton, ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../Config/ChatLogics";
import { debounce } from "lodash";

import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";

import io from "socket.io-client";
// const ENDPOINT = "https://ahead-chats-backend.onrender.com";
var selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat , url , socket } = ChatState();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const selectedChatIdRef = useRef();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${url}/api/message/${selectedChat._id}`,
        config
      );
      // console.log(messages)
      setMessages(data);
      setLoading(false);

    socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Failed to load messages");
    }
  };

 useEffect(() =>{
 setSelectedChat("")
 },[user])


  // useEffect(() => {
  //   socket = io(ENDPOINT);
  //   socket.emit("setup", user);
  //   socket.on("connected", () => setsocketConnected(true));
  //   socket.on("typing", () => setIsTyping(true));
  //   socket.on("stop typing", () => setIsTyping(false));
  // }, []);

  useEffect(() => {
  if (!socket) return;
  socket.emit("setup", user);
  socket.on("connected", () => setsocketConnected(true));
  socket.on("typing", () => setIsTyping(true));
  socket.on("stop typing", () => setIsTyping(false));

  return () => {
    socket.off("connected");
    socket.off("typing");
    socket.off("stop typing");
  };
}, [user]);

  useEffect(() => {
    selectedChatIdRef.current = selectedChat?._id;
  }, [selectedChat]);
   

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer= ${user.token}`,
          },
        };
        
        const { data } = await axios.post(
          `${url}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setNewMessage("");
        setFetchAgain(true);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        alert("Error Occured");
      }
    }
  };

 

  useEffect(() => {
  socket.on("message receieved", (newMessageRecieved) => {
    // check if new message belongs to current selected chat
    if (
      !selectedChatCompare ||
      selectedChatCompare._id !== newMessageRecieved.chat._id
    ) {
      // show toast notification
    } else {
      setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
    }
  });

  return () => {
    socket.off("message receieved");
  };
}, []);


  const debouncedStopTyping = useCallback(
    debounce(() => {
      if (selectedChatIdRef.current) {
        socket.emit("stop typing", selectedChatIdRef.current);
        setTyping(false);
      }
    }, 2000),
    []
  );
  
  

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
 //only emit on the first key press because typing would still false on first keypress before state change renders
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    
    debouncedStopTyping();
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {getSender(user, selectedChat.users)}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {" "}
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                {
                  <div className="messages">
                    <ScrollableChat messages={messages} />
                  </div>
                }
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {istyping && (
                <Box
                  display="flex"
                  alignItems="center"
                  height="30px"
                  pl={2}
                  pb={1}
                >
                  <Box className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </Box>
                </Box>
              )}

              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          dispaly="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
