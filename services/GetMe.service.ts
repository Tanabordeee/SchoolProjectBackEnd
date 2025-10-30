import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

interface JwtPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

export function GetMe(token : string) {
    try {

      const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
      return{
      success: true,
        role: decoded.role,
    }
    } catch (err) {
      return { success: false, message: err };
    }
  };
