import { NextFunction, Request , Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function authMiddleware(req : Request, res :Response , next:NextFunction){
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Not authenticated" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}