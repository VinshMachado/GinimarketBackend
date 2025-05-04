import mongoose from "mongoose";

let model = new mongoose.Schema({
  Name: String,
  Balance: Number,
  Password: String,
  PL: Number,
  ShareHoldings: [
    {
      stockName: String,
      stockQuantity: Number,
      stockprice: Number,
      stockId: String,
      stockImg: String,
    },
  ],
});

let userSchma = mongoose.model("User", model);

export default userSchma;
