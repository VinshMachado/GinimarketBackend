"use client";
import { response } from "express";
import express from "express";
import userSchma from "../Schma/UserSchma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let SigninUser = async (req, res) => {
  if (!req.body) res.status(400).json({ error: "somthing went wrong" });
  let { username, password } = req.body;

  let hashedpass = await bcrypt.hash(password, 10);
  let a = userSchma.findOne({ name: username });
  console.log(a);

  let newUser = new userSchma({
    Name: username,
    Balance: 50000,
    Password: hashedpass,
    PL: 0,
    ShareHoldings: [],
  });
  console.log(newUser);
  newUser.save();

  res.status(200).json({ msg: "user Signed in" });
};

//login ka control//

let LoginUser = async (req, res) => {
  if (!req.body) return res.status(400).json({ error: "somthing went wrong" });

  let { username, password } = req.body;
  console.log(req.body);
  let user = await userSchma.findOne({ Name: username });

  if (!user) return res.status(401);

  let passVal = await bcrypt.compare(password, user.Password);
  if (passVal == true) {
    let token = jwt.sign(
      { userId: user._id, name: user.Name },
      process.env.JWTKEY
    );

    console.log("success");

    res.status(200).json({ msg: "Login successful", token });
  } else {
    console.log("not success");
    res.status(401).json({ msg: "password dosnt match" });
  }
};

let middleWare = (req, res, next) => {
  let token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401);

  try {
    req.user = jwt.verify(token, process.env.JWTKEY);

    next();
  } catch {
    return res.status(401);
  }
};

export default { LoginUser, SigninUser, middleWare };
