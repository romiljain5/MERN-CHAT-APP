export const getSender = (loggedUser, users) => {
  // it will check in users array and return user thats not logged in
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

export const isSameSender = (messages, m, i, userId) => {
  // m - current message, i - index of current message, messages - all messages, userId - logged in user id
  
    /*
  1- will check if lenght of i not exceeds messages length
  2- check if next message is not send by same user
  3- check if next message is undefined
  4- check if the current message is not from current user
    */
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender[0]._id !== m.sender[0]._id ||
      messages[i + 1].sender[0]._id === undefined) &&
        messages[i].sender[0]._id !== userId
  );
};

// for showing user icon at last of the message
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender[0]._id !== userId &&
    messages[messages.length - 1].sender[0]._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender[0]._id === m.sender[0]._id &&
    messages[i].sender[0]._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender[0]._id !== m.sender[0]._id &&
      messages[i].sender[0]._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender[0]._id !== userId)
  )
    return 0;
  else return "auto";
};


export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender[0]._id === m.sender[0]._id;
};

