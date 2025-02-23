/*

POST /register
Adds the user to the database, returns 201 in case of success, returns 400 if the user already exists.

POST /login
Checks the user credentials (username & password).
In case of success,
it responds with the access token.
 Otherwise, it responds with 401 (Unauthorized).

Then define a middleware
that only passes the user if their access token is valid.
If the token is missing or expired, respond with 401.

Bonus:
Implement refresh tokens, then create an endpoint that generates a new access token given the refresh token.
 */

import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { z } from "zod";

import { authRouter } from "./router/authRouter";
import mongoose from "mongoose";
import { authMiddleware } from "./controller/authController";
mongoose.connect("mongodb://localhost:27017/Week6")
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"));
app.use("/", authRouter);
app.get("/api/protected", authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ message: "This is a protected route" });
});
app.listen(3000, () => {
  console.log("Server is running on port:3000");
});


