const User = require("../model/User");
const { createUser, errorHandler } = require("./userHelper");

module.exports = {
  register: async (req, res) => {
    try {
      // Check if the user already exists
      let foundUser = await User.findOne({ username: req.body.username });
      if (foundUser) {
        throw {
          status: 409,
          message: "USER ALREADY EXISTS",
        };
      }
      // Create a new user
      let newUser = await createUser(req.body);

      // Save the user to the database
      let savedUser = await newUser.save();

      // Send the user back to the client
      res.status(201).json({
        message: "User created successfully",
        userObject: savedUser,
      });
    } catch (error) {
      let errorMessage = await errorHandler(error);
      res.status(errorMessage.status).json({
        message: errorMessage.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      let foundUser = await User.findOne({ username: req.body.username });
      // Check if the user exists
      // foundUser is the User object from the database
      if (!foundUser) {
        //if the user does not exist, throw an error
        throw {
          status: 404,
          message: "USER NOT FOUND",
        };
      }
      //throw an error if the password is incorrect
      let checkedPassword = await comparedPassword(
        req.body.password,
        foundUser.password
      );
      if (!checkedPassword) {
        throw {
          status: 401,
          message: "INCORRECT PASSWORD",
        };
      }

      //foundUser is the User object from the database
      console.log("foundUser", foundUser);

      //if the user exists and the password is correct, send the user back to the client
      res.status(200).json({
        message: "User logged in successfully",
        userObject: foundUser,
      });
    } catch (error) {
      let errorMessage = await errorHandler(error);
      res.status(errorMessage.status).json({
        message: errorMessage.message,
      });
    }
  },
};
