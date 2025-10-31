import { Request, Response } from "express";
import { GetMe } from "../services/GetMe.service";

export function GetMeController(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "Not authenticated" });
  const token = authHeader.split(" ")[1];

  const result = GetMe(token);

  if (!result.success) return res.status(401).json(result);

  res.json(result);
}
