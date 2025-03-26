import Stockschma from "../Schma/Stockschma.js";
import express from "express";
import userSchma from "../Schma/UserSchma.js";

let Addstock = async (req, res) => {
  let { StockName, CompanValue, Totalshares, EqupiedShares, ImageUrl, Desc } =
    req.body;

  console.log(req.body);

  if (!req.body) return res.status(403).json({ msg: "no file attached " });

  let OsShares = Totalshares - EqupiedShares;
  let Sharevalue = CompanValue / OsShares;
  let stock = new Stockschma({
    StockName: StockName,
    CompanValue: CompanValue,
    ShareValue: Sharevalue,
    OSshares: OsShares,
    EqupiedShares: EqupiedShares,
    ImageUrl: ImageUrl,
    Desc: Desc,
  });
  stock.save();
  return res.status(200).json({ msg: "all good stock inserted" });
};

let getonestock = async (req, res) => {
  let { _id } = req.body;

  try {
    let data = await Stockschma.find({ _id: _id });

    res.json(data);
  } catch {
    res.status(401).json({ msg: "error occured" });
  }
};

let getStocks = async (req, res) => {
  try {
    let data = await Stockschma.find();

    res.json(data);
  } catch {
    res.status(401).json({ msg: "error occured" });
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let changeStockPrices = async () => {
  let data = await Stockschma.find({}).select("ShareValue _id");
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
  await Stockschma.bulkWrite(bulkOperations);
};

export default { Addstock, getStocks, changeStockPrices, getonestock };
