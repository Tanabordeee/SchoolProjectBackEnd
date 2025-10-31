import { Request , Response } from "express";
import { Student } from "../services/Student.service";
export async function StudentController(req: Request, res: Response) {
    try{
        const {method} =req;
        switch (method){
            case "GET":
            {
                const authHeader = req.headers.authorization;
                if (!authHeader) return res.status(401).json({ success: false, message: "Not authenticated" });
                const token = authHeader.split(" ")[1];
                const data = await Student.GET(token)
                res.status(200).json(data)
            }
        }
    }catch(err : any){
        res.status(500).json({error:err.message})
    }
}