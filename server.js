import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouts from "./Routs/UserRouts.js";
import StockRout from "./Routs/StockRouts.js";
import cors from "cors";
import { createServer } from "http";
import Socketsetup from "./Controler/socket.js";

dotenv.config();

const app = express();
const port = process.env.port || 4000;
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

// HTTP server
const httpServer = createServer(app);

// Socket.IO setup

Socketsetup(httpServer);

// ✅ Start the combined server
httpServer.listen(port, () => {
  console.log(`Server with socket.io running on http://localhost:${port}`);
});
