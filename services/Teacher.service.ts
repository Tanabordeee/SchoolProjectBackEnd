import { supabase } from "../config/supabase";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
interface JwtPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
export const Teacher = {
    async GET(token : string){
        try{
            const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
                  const { data, error } = await supabase
        .from("teacher")
        .select("id")
        .eq("id", decoded.id);
            if (error) throw error
            return data?.[0] || null;
        }catch(err){
            return { success: false, message: err };
        }
    },
}
