const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

let price = 1.2;
let traders = 0;
let data = [];

setInterval(() => {
  price += (Math.random() - 0.5) * 0.001;
  traders += Math.floor(Math.random() * 3 - 1); // simulate fluctuation
  data.push({ time: Date.now(), price });
  if (data.length > 60) data.shift();

  io.emit("tick", { price: parseFloat(price.toFixed(5)), traders, data });
}, 1000);

io.on("connection", (socket) => {
  console.log("User connected");
  socket.emit("tick", { price, traders, data });
});

app.get("/", (req, res) => {
  res.send("PatternTrader Server is running!");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
