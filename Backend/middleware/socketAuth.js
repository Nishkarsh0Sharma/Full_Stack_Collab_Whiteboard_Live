const jwt = require("jsonwebtoken");

function socketAuthMiddleware(io) {
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Auth token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('🔐 Socket auth - decoded token:', { email: decoded.email });
      
      // Find user in database to get the full user object with ID
      const User = require('../models/userModel');
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        console.error('❌ Socket auth - User not found:', decoded.email);
        return next(new Error("User not found"));
      }
      
      socket.user = {
        id: user._id.toString(), // Ensure it's a string
        email: user.email,
        ...decoded
      };
      
      console.log('✅ Socket auth successful:', {
        userId: socket.user.id,
        email: socket.user.email
      });
      next();
    } catch (err) {
      console.error("Socket auth error:", err.message);
      next(new Error("Unauthorized"));
    }
  });
}

module.exports = socketAuthMiddleware;
