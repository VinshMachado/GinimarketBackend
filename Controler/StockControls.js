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

let getStocks = async (req, res) => {
  console.log("stared to run");
  try {
    let data = await Stockschma.find();
    console.log(data);
    res.json(data);
  } catch {
    res.status(401).json({ msg: "error occured" });
  }
};

export default { Addstock, getStocks };
