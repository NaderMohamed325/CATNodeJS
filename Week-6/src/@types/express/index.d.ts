import { userSchema } from "../models/userModel";
import { Request } from "express";
import { z } from "zod";
import { JwtPayload } from "jsonwebtoken";

// Infer the TypeScript type from the Zod schema
export type UserType = z.infer<typeof userSchema>;

// Define a flexible request body type
export type RequestBodyType = {
  [key: string]: any; // Allows adding dynamic properties
};

// Extend Request to include the expected body structure
declare module "express-serve-static-core" {
  interface Request {
    body: RequestBodyType;
    user: JwtPayload | string;
  }
}
