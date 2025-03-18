import express from "express";
import LoginControls from "../Controler/LoginControls.js";

let UserRouts = express.Router();

UserRouts.post("/signin", LoginControls.SigninUser);

UserRouts.get("/login", LoginControls.LoginUser);

export default UserRouts;
