import express from "express";
import LoginControls from "../Controler/LoginControls.js";
import UserControls from "../Controler/UserControls.js";

let UserRouts = express.Router();

UserRouts.post("/signin", LoginControls.SigninUser);

UserRouts.post("/login", LoginControls.LoginUser);

UserRouts.get("/data", LoginControls.middleWare, UserControls.userdata);
UserRouts.post("/buy", LoginControls.middleWare, UserControls.buystock);
UserRouts.post("/sell", LoginControls.middleWare, UserControls.sellstock);
UserRouts.get("/leaders", UserControls.GetTop5);

export default UserRouts;
