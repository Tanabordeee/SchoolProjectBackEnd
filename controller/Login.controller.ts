import { Request, Response } from "express";
import { LoginUser } from "../services/Login.service";
export async function LoginController(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await LoginUser(email, password);
  if (!result.success) return res.status(401).json(result);
  res.cookie("token", result.token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.json({
    success:true,
    role:result.role
  })
}
