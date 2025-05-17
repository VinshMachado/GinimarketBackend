import userSchma from "../Schma/UserSchma.js";
import jwt from "jsonwebtoken";
import express from "express";
import StockSchma from "../Schma/Stockschma.js";
import socketswitch from "./socket.js";

let userdata = async (req, res) => {
  let data = await userSchma.findOne({ _id: req.user.userId });

  res.status(200).json(data);
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let buystock = async (req, res) => {
  socketswitch.setSwitch(true);

  const { name, qty, stockId, stockImg, avg } = req.body;

  const userInv = await userSchma.findById(req.user.userId);
  if (!userInv) return res.status(404).json({ msg: "User not found" });

  const holding = userInv.ShareHoldings.find((h) => h.stockName === name);

  if (holding) {
    holding.stockQuantity += qty;
    holding.avgPrice = holding.avgPrice + avg / holding.stockQuantity;
    console.log(holding);
  } else {
    userInv.ShareHoldings.push({
      stockName: name,
      stockQuantity: qty,
      stockId: stockId,
      stockImg: stockImg,
      avgPrice: avg,
    });
  }

  let stockdata = await StockSchma.findOne({ StockName: name });

  console.log(stockdata.ShareValue);
  userInv.Balance -= stockdata.ShareValue;
  const multiplier = 1 + 0.001 * qty;
  const newprice = stockdata.ShareValue * multiplier;
  console.log(newprice, stockdata.ShareValue);

  // 5) update the master Stock model
  let a = await StockSchma.updateOne(
    { StockName: name },
    {
      $inc: {
        OSshares: -qty,
        EqupiedShares: qty,
      },
      // multiply current share value by (1 + 0.01*qty)
      $set: {
        ShareValue: newprice,
      },
    }
  );

  const freshUser = await userSchma.findById(req.user._id);

  res.status(200).json({ msg: "success", data: freshUser });
  await userInv.save();
  delay(2000);
  console.log("completed");

  socketswitch.setSwitch(false);
};

let sellstock = async (req, res) => {
  socketswitch.setSwitch(true);
  const { name, qty } = req.body;
  console.log("a");

  const userInv = await userSchma.findById(req.user.userId);
  if (!userInv) return res.status(404).json({ msg: "User not found" });

  const holding = userInv.ShareHoldings.find((h) => h.stockName === name);

  if (holding) {
    holding.stockQuantity -= qty;

    if (holding.stockQuantity <= 0) {
      userInv.ShareHoldings = userInv.ShareHoldings.filter(
        (h) => h.stockName !== name
      );
    }
  } else {
    // 3b) otherwise add a new entry
    return res.status(401).json({ msg: "no stock exists" });
  }

  let stockdata = await StockSchma.findOne({ StockName: name });
  console.log(stockdata.ShareValue * qty);

  userInv.Balance += stockdata.ShareValue * qty;
  console.log(
    stockdata.ShareValue * holding.stockQuantity,
    "ss:",
    userInv.Balance
  );
  await userInv.save();
  // 4) persist user changes

  let decrease = stockdata.ShareValue * (0.001 * qty);
  decrease = -decrease;

  await StockSchma.updateOne(
    { StockName: name },
    {
      $inc: {
        OSshares: -qty,
        EqupiedShares: qty,
      },

      $inc: {
        ShareValue: decrease,
      },
    }
  );

  const freshUser = await userSchma.findById(req.user._id);

  res.status(200).json({ msg: "success", data: freshUser });

  socketswitch.setSwitch(false);
};
export default { userdata, buystock, sellstock };
