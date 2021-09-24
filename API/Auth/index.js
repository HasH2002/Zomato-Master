import express from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const Router = express.Router();

/* 
Route         /signup
Description   Signup with email and password
Params        None
Access        Public 
Method        POST 
*/
// modals

import UserModel from "../../database/user/index";

Router.post("/signup", async (req, res) => {
  try {
    const { email, password, fullname, phoneNumber } = req.body.credentials;

    //Check whether email or phone number exists
    const checkUserByEmail = await UserModel.findOne({ email });
    const checkUserByPhone = await UserModel.findOne({ phoneNumber });

    if (checkUserByEmail || checkUserByPhone) {
      return res.json({ error: "User already Exists" });
      // hashing and salting
      bcryptSalt = await bcryptjs.genSalt(8);
      hashedPassword = await bcryptjs.hash(password, bcryptSalt);
      //   DB
      await UserModel.create({
        ...req.body.credentials,
        password: hashedPassword,
      });

      // jwt
      const token = jwt.sign({ user: { fullname, email } }, "ZomatoApp");
      return res.status(200).json({ token });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
