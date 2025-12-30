const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async ({ req }) => {
  const token = req.headers.authorization || "";

  if (!token) return { user: null };

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    const user = await User.findById(decoded.id).select("-password");
    return { user };
  } catch {
    return { user: null };
  }
};

module.exports = auth;
