import { ZodError } from "zod";
import { User, userSchema } from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import { SchemaValidation } from "../utils/validation/SchemaValidation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signupUser = async (req: Request, res: Response): Promise<void> => {
  if (!req.body.data || !req.body.data.user) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { data, errors } = SchemaValidation(userSchema, req.body.data.user);

  if (errors) {
    res.status(400).json({ errors });
    return;
  }

  try {
    const newUser = await User.create(data);
    res.status(201).json({
      message: "User has been Created",
      data: {
        newUser,
      },
    });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ error: "User already exists" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(401).json({
      status: "fail",
      message: "Please provide us a valid email and password",
    });
    return;
  }
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
    return;
  }

  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
    return;
  }

  const token = jwt.sign({ id: user._id }, "This Should be in .env file", {
    expiresIn: "1h",
  });
  res.status(200).json({
    status: "success",
    token,
  });
};

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      const decoded = jwt.verify(token, "This Should be in .env file");
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Unauthorized" });
      console.log(token);
    }
  }
};

export { signupUser, login, authMiddleware };