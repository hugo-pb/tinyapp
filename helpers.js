// find user by email //

const getUserByEmail = (email, database) => {
  for (id in database) {
    if (database[id].email === email) {
      return id;
    }
  }
  return false;
};

module.exports = { getUserByEmail };
