import Stockschma from "../Schma/Stockschma.js";
import express from "express";
import middleWare from "../Controler/LoginControls.js";
import Stockcontrols from "../Controler/StockControls.js";

const StockRout = express.Router();

StockRout.post("/add", middleWare.middleWare, Stockcontrols.Addstock);
StockRout.get("/getstocks", Stockcontrols.getStocks);
StockRout.post("/one", Stockcontrols.getonestock);

export default StockRout;
