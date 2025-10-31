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

export function requireRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: "Not authenticated" });
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      if (decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
      }
      (req as any).user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}
