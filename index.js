import dotenv from 'dotenv';
dotenv.config();
import express from "express";

import { check, validationResult } from "express-validator";
import connectDB from "./db/index.js";
import { User } from "./models/user.model.js";
import bcrypt from "bcrypt";
import userRouter from "./routes/user.route.js";
import session from "express-session";
import cookieParser from "cookie-parser"

const app = express();
const PORT = 8000;


//mongoDB connect
connectDB()

//middleware
app.use(express.json())
app.use(cookieParser())
app.use((req,res,next) => {
    console.log("request method:",req.method);
    next();
})

app.use(
    session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        // Omit the store option if you're not using a specific session store
    })
);

 app.use("/api/v1/user",userRouter);

 const RegisterUser = [
   check("fullname").notEmpty().withMessage("Full name cannot be empty"),
   check("username").notEmpty().withMessage("username cannot be empty"),
   check("email").isEmail().withMessage("Invalid Email!!"),
   check("Password").notEmpty().withMessage("Password can't be empty"),
 ]


app.get("/",async(req,res) => {
	const user = await User.findOne({});
	console.log(user);
	const userInfo = {
        fullName: user.fullname,
        userName: user.username,
        email: user.email
	}
     res.json( userInfo);
})


/*
app.post("/register", RegisterUser, async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
       const { fullname, username, email, Password } = req.body;
      const password = bcrypt.hashSync(Password, 10);

   const user = await User.create({
             fullname,
             username,
             email,
             password,
     })

    res.json({
      fullname: fullname,
      username: username,
      email: email,
    })
}) */

app.listen(PORT, () => console.log("Server is running on port:",PORT))