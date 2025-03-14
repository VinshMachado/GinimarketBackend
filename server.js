import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.port;
const databaseurl = process.env.db_link;

// connection//
mongoose
  .connect(`${databaseurl}`)
  .then(console.log(`connected to db`))
  .catch(() => {
    console.log(`some error `);
  });

app.listen(port, () => {
  console.log("port s running");
});
