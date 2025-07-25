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
      stockId: String,
      stockImg: String,
      avgPrice: Number,
    },
  ],
});

let userSchma = mongoose.model("User", model);

export default userSchma;
