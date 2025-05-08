



export const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
  };



  export const getSenderFull = (loggedUser, users) => {
    // Ensure loggedUser and users are defined and valid before attempting to access properties
    if (!loggedUser || !Array.isArray(users) || users.length === 0) {
      return null; // or return a fallback object if necessary
    }
  
    // Find the user that isn't the loggedUser
    return users.find(user => user._id !== loggedUser._id) || null;
  };
  
  
  
  export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  
  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[i].sender._id !== userId
    );
  };
  
  export const isOwnMessage = (m, userId) => {
    return m.sender._id === userId;
  };
  