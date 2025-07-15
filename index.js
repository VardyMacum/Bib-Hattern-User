// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict to your domain in production
    methods: ["GET", "POST"]
  }
});

let lastTick = {
  price: 1.2,
  traders: 0,
  data: Array.from({ length: 60 }, (_, i) => ({
    time: Date.now() - (60 - i) * 1000,
    price: 1.2,
  })),
};

io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  // Send current tick on connect
  socket.emit("tick", lastTick);

  // When a client sends a tick
  socket.on("tick", (msg) => {
    lastTick = msg;

    // Broadcast to all other clients (except sender)
    socket.broadcast.emit("tick", lastTick);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Socket.IO server running on port ${PORT}`);
});
