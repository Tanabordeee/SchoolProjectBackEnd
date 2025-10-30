import { Request, Response } from "express";
import { GetMe } from "../services/GetMe.service";

export function GetMeController(req: Request, res: Response) {
  const token = req.cookies.token; 
  if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

  const result = GetMe(token);

  if (!result.success) return res.status(401).json(result);

  res.json(result);
}
