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

let price = 1.2;
let traders = 0;
let data = Array.from({ length: 60 }, (_, i) => ({
  time: Date.now() - (60 - i) * 1000,
  price
}));

setInterval(() => {
  // Simulate price changes
  price *= 1 + (Math.random() - 0.5) * 0.001;
  price = +price.toFixed(5);
  traders += Math.floor(Math.random() * 3 - 1); // fluctuate
  traders = Math.max(1, traders);
  data.push({ time: Date.now(), price });
  data.shift();

  io.emit("tick", { price, traders, data });
}, 1000);

io.on("connection", socket => {
  console.log("Client connected");
  socket.emit("tick", { price, traders, data });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
