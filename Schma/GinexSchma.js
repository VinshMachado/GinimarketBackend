import express from "express";
import mongoose from "mongoose";

let ginex = new mongoose.Schema({
  Current: Number,
});
const ginexSchma = mongoose.model("ginex", ginex);

export default ginexSchma;
