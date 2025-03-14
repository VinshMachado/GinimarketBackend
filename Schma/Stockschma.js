import mongoose from "mongoose";

const StockSchma = new mongoose.Schema({
  StockName: String,
  CompanyValue: Number,
  ShareValue: Number,
  OSshares: Number,
  EqupiedShares: Number,
  Profit: Number,
});

const Stock = mongoose.model("Stocks", StockSchma);

export default { Stock };
