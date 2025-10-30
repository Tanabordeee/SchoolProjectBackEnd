import { NextFunction, Request , Response } from "express";
import dotenv from "dotenv";
dotenv.config();
export async function authMiddleware(req : Request, res :Response , next:NextFunction){
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token found" });
    try {
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}