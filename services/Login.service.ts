import { supabase } from "../config/supabase";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

const ROLE_TABLES = [
  { table: "teacher", role: "teacher" },
  { table: "students", role: "student" },
  { table: "parents", role: "parent" },
];

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function LoginUser(email: string, password: string) {
  console.log(email , password)
  for (const { table, role } of ROLE_TABLES) {
    const { data: user, error } = await supabase
      .from(table)
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) continue;

    const isValid = await bcrypt.compare(password, user.password);
    console.log(isValid)
    if (!isValid) continue;

    const token = jwt.sign({ id: user.id, role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    return {
      success: true,
      role,
      token,
    };
  }

  return {
    success: false,
    message: "Email or password incorrect",
  };
}
