import { Request , Response } from "express";
import { Parent } from "../services/Parent.service";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Student } from "../services/Student.service";
dotenv.config();
interface JwtPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
export async function ChangePassword(req: Request, res: Response){
    try{
        const { method } = req;
        switch(method){
            case "PATCH": {
                const { password } = req.body; 
                 const token = req.cookies.token; 
                if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });
                const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
                let data;
                if(decoded.role === "parent"){
                    data = await Parent.PATCH(password, token);
                }else if(decoded.role === "student"){
                    data = await Student.PATCH(password , token);
                }
                return res.status(200).json(data);
            }
        }
    }catch(err){

    }
}