import React, { useEffect, useRef } from 'react';
import { Avatar, Box, Text, Tooltip } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import {
  isOwnMessage,
  isSameSender,
  isLastMessage,
} from '../Config/ChatLogics';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <Box overflowY="auto" maxHeight="480px" px={3}>
      
      {messages &&
        messages.map((m, i) => (
          <Box
            key={m._id}
            display="flex"
            justifyContent={isOwnMessage(m, user._id) ? 'flex-end' : 'flex-start'}
          >
            {
              (!isOwnMessage(m, user._id) &&
                (isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id))) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    // color={'green'}
                    name={m.sender.name}
                    // src={m.sender.pic}
                  />
                </Tooltip>
              )
            }

            <Box
              bg={isOwnMessage(m, user._id) ? '#BEE3F8' : '#B9F5D0'}
              color="black"
              px={3}
              py={2}
              borderRadius="20px"
              maxWidth="75%"
              m={1}
            >
              <Text>{m.content}</Text>
            </Box>
          </Box>
        ))}
      <div ref={chatEndRef} />
      
    </Box>
  );
};

export default ScrollableChat;
