import { Router } from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

router.route("/register").post(async (req,res) => {
//1) get the data
 const { fullname, username, email, password } = req.body;

//2) validate the data
  if (!(fullname && username && email && password)) {
       res.status(400).send("All fields are required!!")
  }

//3) check existing user
     const existingUser = await User.findOne({ email });
     if (existingUser) {
          res.status(400).send("User is already exist with this email!")
     }

//4) hashed the password
      const Hashedpassword = bcrypt.hashSync(password, 10);

//5) save in the DB
   const user = await User.create({
             fullname,
             username,
             email,
             password: Hashedpassword
     })

//6) generate the token for user and send it
 const token = jwt.sign(
    {id: user._id, email},
     process.env.JWT_SECRET,{
        expiresIn: "2h"
    }
 );
 user.token = token
 user.password = undefined //don't want to show password

 res.status(201).json(user)

})

router.route("/login").post( async (req,res) => {

//get the data from frontend or user or body
  const { username, password } = req.body;

  if (!(username && password)) {
         res.status(400).send("Please fill all the fields")
  }

  // Find the user by username in DB
  const user = await User.findOne({ username });

  if (!user) {
    console.log("User not found");
    throw new Error("Incorrect Username or Password");
  }

  // Compare the entered password with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);//gives boolean value -> TRUE or FALSE

  if (!passwordMatch) {
    console.log("Incorrect Password");
    throw new Error("Incorrect Username or Password");
  }

  if (user && passwordMatch) {
      const token = jwt.sign(
       {id: user._id},
        process.env.JWT_SECRET ,
    {
        expiresIn: "2h"
    }
    );
    user.token = token
    user.password = undefined

    //cookie section
       const options = {
           expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
           httpOnly: true
       };
       res.status(200).cookie("token",token, options).json({
                success: true,
                token,
                user
       })
  }

  res.end("User logged in successfully");

})

router.route("/logout").post(async (req, res) => {
try {
    // Clear the token on the client side (optional)

    // For server-side logout, add the token to a blacklist
    // You might have a database or some storage for blacklisted tokens
    const { token } = req.cookies;
      console.log("requset cookies:",req.cookies);
    console.log("Tokens:",token);
     res.clearCookie("token");

    // Blacklist the token (this is a simplified example)
    // You might want to store blacklisted tokens in a more persistent storage
    // and check against it on every incoming request
    const blacklistedTokens = new Set();
    blacklistedTokens.add(token);

     console.log(blacklistedTokens);

    // Respond with a success message
    res.status(200).send("User logged out successfully");
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



export default router;