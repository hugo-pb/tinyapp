// find user by email //

const getUserByEmail = (email, database) => {
  for (id in database) {
    if (database[id].email === email) {
      return id;
    }
  }
  return undefined;
};

const generateRandomString = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 6; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];

  return result;
};
const urlsForUser = (id, database) => {
  const arr = [];
  for (key in database) {
    if (database[key].userID == id) {
      arr.push(database[key]);
    }
  }
  return arr;
};
const CheckIfIdExist = (id, database) => {
  for (i in database) {
    if (id === i) {
      return true;
    }
  }
  return false;
};
const CheckIfIdExistOwner = (arr, id) => {
  for (i in arr) {
    if (id === arr[i].id) {
      return true;
    }
  }
  return false;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
  CheckIfIdExist,
  CheckIfIdExistOwner,
};
