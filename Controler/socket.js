import { Server, Socket } from "socket.io";
import StockSchma from "../Schma/Stockschma.js";
import userSchma from "../Schma/UserSchma.js";
import jwt from "jsonwebtoken";
let io = null;
let userdata = null;

//get http //
const Socketsetup = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Allow all origins — adjust for production
      methods: ["GET", "POST"],
    },
  });
  io.on("connect", (socket) => {
    let token = socket.handshake.auth.token;

    if (token) {
      userdata = jwt.verify(token, process.env.JWTKEY);
    }
  });

  changeStockPrices();
};

//delay thing//
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//change price and update socket thingy //
let changeStockPrices = async () => {
  console.log("changed price");
  let data = await StockSchma.find({}).select("ShareValue _id");
  let updatedvalue = [];

  data.forEach((element) => {
    let randomNum = Math.floor(Math.random() * 2);
    if (randomNum == 1) {
      element.ShareValue = element.ShareValue + element.ShareValue * 0.005;
    } else {
      element.ShareValue = element.ShareValue - element.ShareValue * 0.005;
    }
    updatedvalue.push({ _id: element._id, ShareValue: element.ShareValue });
  });
  let bulkOperations = updatedvalue.map((stock) => ({
    updateOne: {
      filter: { _id: stock._id },
      update: { $set: { ShareValue: stock.ShareValue } },
    },
  }));

  await delay(2500);
  await StockSchma.bulkWrite(bulkOperations);
  if (io) {
    io.emit("price-change", updatedvalue);
  }
  changeStockPrices();
};

export default Socketsetup;
