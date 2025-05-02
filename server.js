import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouts from "./Routs/UserRouts.js";
import StockRout from "./Routs/StockRouts.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();

const app = express();
const port = process.env.port || 4000; // Fallback port
const databaseurl = process.env.db_link;

console.log(databaseurl);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", UserRouts);
app.use("/stock", StockRout);

// MongoDB connection
mongoose
  .connect(databaseurl)
  .then(() => console.log(`connected to db`))
  .catch(() => console.log(`some error`));

// ✅ Wrap express in HTTP server
const httpServer = createServer(app);

// ✅ Socket.IO setup on same server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins — adjust for production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

// ✅ Start the combined server
httpServer.listen(port, () => {
  console.log(`Server with socket.io running on http://localhost:${port}`);
});
