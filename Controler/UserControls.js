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
  const { name, qty } = req.body;
  console.log("a");

  const userInv = await userSchma.findById(req.user.userId);
  if (!userInv) return res.status(404).json({ msg: "User not found" });

  const holding = userInv.ShareHoldings.find((h) => h.stockName === name);

  if (holding) {
    // 3a) if it exists, bump the qty
    holding.stockQuantity += qty;
  } else {
    // 3b) otherwise add a new entry
    userInv.ShareHoldings.push({ stockName: name, stockQuantity: qty });
  }

  // 4) persist user changes
  await userInv.save();

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
};
export default { userdata, buystock };
