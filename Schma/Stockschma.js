import mongoose from "mongoose";

const Stock = new mongoose.Schema({
  StockName: String,
  CompanyValue: Number,
  ShareValue: Number,
  OSshares: Number,
  EqupiedShares: Number,
  ImageUrl: String,
  Desc: String,
});

const StockSchma = mongoose.model("Stocks", Stock);

export default StockSchma;
