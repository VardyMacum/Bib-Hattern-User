const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  }
});

let chartData = [];

io.on("connection", socket => {
  console.log("New client connected");

  socket.on("tick", data => {
    chartData = data;
    socket.broadcast.emit("tick", data); // Send to all except sender
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
