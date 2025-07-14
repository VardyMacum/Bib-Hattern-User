// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("PatternTrader WebSocket running");
});

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let chartData = [];

io.on('connection', socket => {
  console.log("🔌 Client connected");

  socket.on('tick', data => {
    chartData = data;
    socket.broadcast.emit('tick', data); // Send to all other clients
  });

  socket.on('disconnect', () => {
    console.log("❌ Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ WebSocket server running on port ${PORT}`);
});
