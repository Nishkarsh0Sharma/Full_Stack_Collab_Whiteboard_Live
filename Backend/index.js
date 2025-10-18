require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDatabase = require('./db');
const userRoute = require('./routes/userRoute');
const canvasRoute = require('./routes/canvasRoute');
const { Server } = require("socket.io");
const http = require("http");

// ✅ Middlewares
const socketAuthMiddleware = require("./middleware/socketAuth");
const checkCanvasAccess = require("./middleware/checkCanvasAccess");

connectToDatabase();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/users', userRoute);
app.use('/canvas', canvasRoute);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// 🔒 Attach auth middleware
socketAuthMiddleware(io);

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id, "user:", socket.user?.email);

  // 🔒 Secure join
  socket.on("joinCanvas", (payload) => {
    console.log(`🚪 Join canvas request from ${socket.user?.email}:`, payload);
    checkCanvasAccess(async (sock, { foundCanvas, canvasId }) => {
      const email = sock.user.email;
      sock.join(canvasId);
      console.log(`🖌️ ${email} successfully joined canvas ${canvasId}`);

      // Notify others that a user joined
      sock.to(canvasId).emit("userJoined", {
        userId: sock.user.email,
        socketId: sock.id,
        timestamp: new Date().toISOString()
      });

      sock.emit("loadCanvas", {
        success: true,
        canvas: foundCanvas
      });
      
      console.log(`📤 Sent loadCanvas to ${email} with ${foundCanvas.elements?.length || 0} elements`);
    })(socket, payload);
  });

  // 🔒 Secure update - for complete canvas updates
  socket.on("updateCanvas", (payload) =>
    checkCanvasAccess(async (sock, { foundCanvas, canvasId, elements }) => {
      console.log(`💾 Updating canvas ${canvasId} with ${elements?.length || 0} elements`);
      foundCanvas.elements = elements;
      await foundCanvas.save();

      console.log(`📡 Broadcasting to room ${canvasId}:`, elements?.length || 0, 'elements');
      // Broadcast to others
      sock.to(canvasId).emit("canvasUpdated", { canvasId, elements });
    })(socket, payload)
  );

  // 🖌️ Real-time drawing events - for live drawing without saving to DB
  socket.on("drawing", (payload) =>
    checkCanvasAccess(async (sock, { canvasId, drawingData }) => {
      // Broadcast drawing data immediately to other users
      sock.to(canvasId).emit("userDrawing", {
        userId: sock.user.email,
        socketId: sock.id,
        drawingData,
        timestamp: new Date().toISOString()
      });
    })(socket, payload)
  );

  // 📍 Cursor tracking for real-time collaboration
  socket.on("cursorMove", (payload) =>
    checkCanvasAccess(async (sock, { canvasId, cursorData }) => {
      sock.to(canvasId).emit("userCursor", {
        userId: sock.user.email,
        socketId: sock.id,
        cursor: cursorData,
        timestamp: new Date().toISOString()
      });
    })(socket, payload)
  );

  // 🎨 Tool selection broadcast
  socket.on("toolChange", (payload) =>
    checkCanvasAccess(async (sock, { canvasId, tool, color, strokeWidth }) => {
      sock.to(canvasId).emit("userToolChange", {
        userId: sock.user.email,
        socketId: sock.id,
        tool,
        color,
        strokeWidth,
        timestamp: new Date().toISOString()
      });
    })(socket, payload)
  );

  // 🚪 Handle leaving canvas
  socket.on("leaveCanvas", (payload) => {
    if (payload && payload.canvasId) {
      socket.leave(payload.canvasId);
      socket.to(payload.canvasId).emit("userLeft", {
        userId: socket.user?.email,
        socketId: socket.id,
        timestamp: new Date().toISOString()
      });
      console.log(`👋 ${socket.user?.email} left canvas ${payload.canvasId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    // Notify all rooms this user was in that they disconnected
    socket.broadcast.emit("userDisconnected", {
      userId: socket.user?.email,
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
  });
});


server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
