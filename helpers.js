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
module.exports = { getUserByEmail, generateRandomString };
