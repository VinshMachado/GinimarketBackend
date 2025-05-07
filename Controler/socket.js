import { Server, Socket } from "socket.io";
import StockSchma from "../Schma/Stockschma.js";
import userSchma from "../Schma/UserSchma.js";
import jwt from "jsonwebtoken";

let io = null;
let userdata = null;
let SocketSwitch = false;

let setSwitch = (data) => {
  SocketSwitch = data;
};

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
  console.log(SocketSwitch);
  if (!SocketSwitch) {
    let data = await StockSchma.find({}).select("ShareValue _id");
    let updatedvalue = [];
    let colorBool = [];

    data.forEach((element) => {
      let oldprice = element.ShareValue;
      let randomNum = Math.floor(Math.random() * 2);
      if (randomNum == 1) {
        element.ShareValue = element.ShareValue + element.ShareValue * 0.01;
      } else {
        element.ShareValue = element.ShareValue - element.ShareValue * 0.01;
      }

      updatedvalue.push({ _id: element._id, ShareValue: element.ShareValue });
      if (element.ShareValue > oldprice) {
        colorBool.push(true);
      } else {
        colorBool.push(false);
      }
    });

    let bulkOperations = updatedvalue.map((stock) => ({
      updateOne: {
        filter: { _id: stock._id },
        update: { $set: { ShareValue: stock.ShareValue } },
      },
    }));

    await StockSchma.bulkWrite(bulkOperations);
    if (io) {
      io.emit("price-change", updatedvalue, colorBool);
    }
  } else {
    console.log("waiting for update");
  }
  await delay(2000);

  changeStockPrices();
};

export default { Socketsetup, setSwitch };
