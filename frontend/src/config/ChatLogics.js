export const getSender = (loggedUser, users) => {
  // it will check in users array and return user thats not logged in
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};