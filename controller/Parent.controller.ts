import { Request, Response } from "express";
import { Parent } from "../services/Parent.service";

export async function ParentController(req: Request, res: Response) {
  try {
    const { method } = req;

    switch (method) {
      case "GET": {
        const token = req.cookies.token;
        if (!token)
          return res
            .status(401)
            .json({ success: false, message: "Not authenticated" });

        const data = await Parent.GET(token);
        return res.status(200).json(data);
      }
      default:
        return res
          .status(405)
          .json({ success: false, message: "Method not allowed" });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
}
