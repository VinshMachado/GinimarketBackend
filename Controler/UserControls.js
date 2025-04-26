import userSchma from "../Schma/UserSchma.js";
import jwt from "jsonwebtoken";
import express from "express";
import StockSchma from "../Schma/Stockschma.js";

let userdata = async (req, res) => {
  console.log(req.user.userId);

  let data = await userSchma.findOne({ _id: req.user.userId });
  console.log(data);
  res.status(200).send(data);
  console.log("run");
};

let buystock = async (req, res) => {
  let { name, qty } = req.body;

  let stock = await StockSchma.findOne({ StockName: name });

  await userSchma.updateOne(
    { Name: req.user.name },
    {
      $push: { ShareHoldings: { stockName: name, stockQuantity: qty } },
      $inc: { Balance: -(stock.ShareValue * qty) },
    }
  );

  await StockSchma.updateOne(
    { StockName: name },
    {
      $inc: {
        OSshares: -qty,
        EqupiedShares: qty,
      },
      $mul: {
        ShareValue: 1.01, // Multiply price by 1.01 → (price + 1%)
      },
    }
  );

  let data = await userSchma.findOne({ _id: req.user.userId });

  res.status(200).json({ msg: "success", data: { data } });
};

export default { userdata, buystock };
