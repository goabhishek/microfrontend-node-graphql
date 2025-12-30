const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

module.exports = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return user;
    }
  },

  Mutation: {
    register: async (_, { name, email, password }) => {
      const userExists = await User.findOne({ email });
      if (userExists) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });

      return {
        token: generateToken(user._id),
        user
      };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      return {
        token: generateToken(user._id),
        user
      };
    }
  }
};
