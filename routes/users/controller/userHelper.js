const bcrypt = require("bcrypt");
User = require("../model/User");

// Number of rounds to generate the salt
const saltRounds = 10;

// Create a new user
const createUser = async (user) => {
  let newUser = await new User({
    username: user.username,
    password: user.password,
  });
  return newUser;
};

// Hash the password
const hashPassword = async (password) => {
  let generatedSalt = await bcrypt.genSalt(saltRounds);
  let hashedPassword = await bcrypt.hash(password, generatedSalt);
  return hashedPassword;
};

// Compare the password
const comparedPassword = async (plaintextPassword, dbPassword) => {
  let checkedPassword = await bcrypt.compare(plaintextPassword, dbPassword);
  return checkedPassword;
};

// handle errors
const errorHandler = async (error) => {
  return {
    status: error.status,
    message: error.message || "Something went wrong",
  };
};

// Export the functions
module.exports = {
  createUser,
  hashPassword,
  comparedPassword,
  errorHandler,
};
