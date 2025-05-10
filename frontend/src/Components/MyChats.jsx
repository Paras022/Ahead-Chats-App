import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import { Text, Box, Stack } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderFull } from "../Config/ChatLogics";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(true);
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    socket,
    onlineUsers,
    url,
  } = ChatState();

  const fetchChats = async () => {
    // console.log(user._id);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${url}/api/chat`, config);

      setChats(data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching chats:",
        error.response ? error.response.data : error.message
      );
      alert("failed to load chats");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  useEffect(() => {
    if (!socket) return;

    const handleChatReceived = (newChat) => {
      setChats((prevChats) => {
        const exists = prevChats.find((chat) => chat._id === newChat._id);
        return exists ? prevChats : [newChat, ...prevChats];
      });
    };

    socket.on("chat-received", handleChatReceived);

    return () => {
      socket.off("chat-received", handleChatReceived);
    };
  }, [socket, setChats]);

  // const getlatestmessage = ()  => chats.latestMessage.content;

  return (
    <Box
      // only display on md screens
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {loading ? (
          <ChatLoading />
        ) : chats.length !== 0 ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text display="flex" alignItems="center">
                  {!chat.isGroupChat
                    ? getSenderFull(loggedUser, chat.users).name
                    : chat.chatName}
                  {loggedUser &&
                    getSenderFull(loggedUser, chat.users) && // Ensure getSenderFull doesn't return null in querying is late
                    onlineUsers.includes(
                      getSenderFull(loggedUser, chat.users)._id
                    ) && (
                      <span
                        style={{
                          color: "green",
                          fontSize: "16px",
                          marginLeft: "8px",
                        }}
                      >
                        ●
                      </span>
                    )}
                </Text>

                {/* <Text>
                  
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text> */}
              </Box>
            ))}
          </Stack>
        ) : (
          <Text>Search Users and start chatting</Text>
          // <ChatLoading/>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
