import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRouts from "./Routs/UserRouts.js";
import StockRout from "./Routs/StockRouts.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.port;
const databaseurl = process.env.db_link;

app.get("/", (req, res) => {
  res.send("hello");
});
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

app.listen(port, () => {
  console.log("port s running at", port);
});
