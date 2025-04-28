import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouts from "./Routs/UserRouts.js";
import StockRout from "./Routs/StockRouts.js";
import cors from "cors";
import stockthing from "./Controler/StockControls.js";
import { Server } from "socket.io";

dotenv.config();
const app = express();
const port = process.env.port;
const databaseurl = process.env.db_link;
console.log(databaseurl);

app.use(cors());

// connection//
mongoose
  .connect(`${databaseurl}`)
  .then(console.log(`connected to db`))
  .catch(() => {
    console.log(`some error `);
  });

app.use(express.json());

app.use("/user", UserRouts);
app.use("/stock", StockRout);

stockthing.changeStockPrices();

app.listen(port, () => {
  console.log("port s running at", port);
});
