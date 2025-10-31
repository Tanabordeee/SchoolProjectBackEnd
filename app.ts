import express, { Express ,  Request, Response } from "express";
import router from "./route/route";
import cookieParser from "cookie-parser";
import cors from "cors";
export const createApp = (): Express => {
  const app = express();
  app.use(cookieParser());
    app.use(
    cors({
      origin: ["http://localhost:5173" , "https://school-project-front-end-ruddy.vercel.app"], // frontend ของคุณ
      credentials: true, // อนุญาตส่ง cookie/token ไปด้วยถ้ามี
    })
  );
  app.use(express.json());
    app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
  });
  app.use("/api", router);
  return app;
};