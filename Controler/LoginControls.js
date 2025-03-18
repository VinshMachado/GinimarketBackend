import { response } from "express";
import express from "express";
import userSchma from "../Schma/UserSchma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

let SigninUser = async (req, res) => {
  if (!req.body) res.status(400).json({ error: "somthing went wrong" });
  let { name, password } = req.body;

  let hashedpass = await bcrypt.hash(password, 10);

  let newUser = new userSchma({
    Name: name,
    Balance: 500000,
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
  if (!req.body) res.status(400).json({ error: "somthing went wrong" });

  let { username, password } = req.body;
  let user = await userSchma.findOne({ name: username });
  let passVal = await bcrypt.compare(password, user.Password);
  console.log(passVal);

  let token = jwt.sign(
    { userId: user._id, name: user.Name },
    process.env.JWTKEY,
    { expiresIn: "1d" }
  );
  console.log(token);

  console.log(user);
  res.status(200).json({ msg: "working fine" });
};

let middleWare = (req, res, next) => {
  let token = req.header("Authorization")?.split(" ")[1];

  if (!token) res.status(401);

  try {
    req.user = jwt.verify(token, process.env.JWTKEY);
    next();
  } catch {
    res.status(401);
  }
};

export default { LoginUser, SigninUser, middleWare };
