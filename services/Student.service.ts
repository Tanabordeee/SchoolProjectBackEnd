import { supabase } from "../config/supabase";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
interface JwtPayload {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
export const Student = {
    async GET(token : string){
        try{
            const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
                  const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", decoded.id);
            if (error) throw error
            return data?.[0] || null;
        }catch(err){
            return { success: false, message: err };
        }
    },
    async GET_ID(id : string){
        try{
            const {data , error} = await supabase.from("students").select("nickname").eq("id" , id).single();
            if (error) throw error
            return data
        }catch(err){
            return { success: false, message: err };
        }
    },
    async PATCH(password: string, token: string) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
          const hashedPassword = await bcrypt.hash(password, 10);
          const { data, error } = await supabase
            .from("students")
            .update({ password: hashedPassword })
            .eq("id", decoded.id);
    
          if (error) throw error;
          return { success: true, data: data?.[0] };
        } catch (err: any) {
          return { success: false, message: err.message || err };
        }
    }
}
