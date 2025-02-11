const http = require("http"); 
const socketIo = require("socket.io"); 
const express = require("express");
const mongoose = require("mongoose"); 
const dotenv = require("dotenv");
const cors = require("cors");
// Express ve HTTP server kurulumu
const app = express(); 
const server = http.createServer(app); 
const io = socketIo(server);

// Middleware ve Router'lar
const socketMiddleware = require("./middleware/socket/socketMiddleware");
const socketHandler = require("./modules/socket");
const authRouter = require("./router/authRouter");
const jobRouter = require("./router/jobRouter");

dotenv.config(); 

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "DELETE", "PUT"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);
app.use("/api", jobRouter);

// MongoDB bağlatısı
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("🚀 DB Connection is Successful"))
  .catch((err) => {
    console.log("❌ DB Connection Error:", err);
  });

// Socket.IO Middleware ve Handler
io.use(socketMiddleware); 
socketHandler(io); 


// Server'ı başlat
server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
}).on("error", (err) => {
  console.error("❌ Server error:", err.message);
});
