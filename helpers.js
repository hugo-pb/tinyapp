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
module.exports = { getUserByEmail, generateRandomString, urlsForUser };
