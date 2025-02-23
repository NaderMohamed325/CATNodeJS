import express from "express";
import { signupUser, login } from "../controller/authController";

const authRouter = express.Router();

authRouter.route('/api/signup')
  .post(signupUser);

authRouter.route('/api/login')
  .post(login);

export { authRouter };