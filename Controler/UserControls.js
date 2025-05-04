import userSchma from "../Schma/UserSchma.js";
import jwt from "jsonwebtoken";
import express from "express";
import StockSchma from "../Schma/Stockschma.js";

let userdata = async (req, res) => {
  let data = await userSchma.findOne({ _id: req.user.userId });

  res.status(200).json(data);
};

let buystock = async (req, res) => {
  const { name, qty, stockId, stockImg } = req.body;

  console.log("a");

  const userInv = await userSchma.findById(req.user.userId);
  if (!userInv) return res.status(404).json({ msg: "User not found" });

  const holding = userInv.ShareHoldings.find((h) => h.stockName === name);

  if (holding) {
    // 3a) if it exists, bump the qty
    holding.stockQuantity += qty;
  } else {
    // 3b) otherwise add a new entry
    userInv.ShareHoldings.push({
      stockName: name,
      stockQuantity: qty,
      stockId: stockId,
      stockImg: stockImg,
    });
  }
  let stockdata = await StockSchma.findOne({ StockName: name });
  console.log(stockdata.ShareValue);
  userInv.Balance -= stockdata.ShareValue;

  // 5) update the master Stock model
  await StockSchma.updateOne(
    { StockName: name },
    {
      $inc: {
        OSshares: -qty,
        EqupiedShares: qty,
      },
      // multiply current share value by (1 + 0.01*qty)
      $mul: {
        ShareValue: 1 + 0.01 * qty,
      },
    }
  );
  const freshUser = await userSchma.findById(req.user._id);

  res.status(200).json({ msg: "success", data: freshUser });
  await userInv.save();
  console.log("completed");
};

let sellstock = async (req, res) => {
  const { name, qty } = req.body;
  console.log("a");

  const userInv = await userSchma.findById(req.user.userId);
  if (!userInv) return res.status(404).json({ msg: "User not found" });

  const holding = userInv.ShareHoldings.find((h) => h.stockName === name);

  if (holding) {
    // 3a) if it exists, bump the qty
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
  console.log(stockdata.ShareValue);
  userInv.Balance += stockdata.ShareValue;
  // 4) persist user changes

  let multiplier = 1 - 0.01 * qty;
  await StockSchma.updateOne(
    { StockName: name },
    {
      $inc: {
        OSshares: -qty,
        EqupiedShares: qty,
      },
      // multiply current share value by (1 + 0.01*qty)
      $mul: {
        ShareValue: multiplier,
      },
    }
  );
  const freshUser = await userSchma.findById(req.user._id);

  res.status(200).json({ msg: "success", data: freshUser });
  await userInv.save();
};
export default { userdata, buystock, sellstock };
