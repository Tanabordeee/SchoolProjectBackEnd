export const CONFIG = {
  CENTER: { lat: 13.913084367975618, lng: 100.55682781173479 },
  RADIUS: 300,
  PORT: Number(process.env.PORT) || 3000,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
export type Parent = {
  prefix: string;
  firstname: string;
  lastname: string;
  carRegister: string;
  telephone: string;
  email:string;
  password:string;
};

export type Student = {
  prefix: string;
  firstname: string;
  lastname: string;
  nickname: string;
  studentId: string;
  grade: string;
  telephone: string;
  language: string;
    email:string;
  password:string;
};
