import express, { Express ,  Request, Response } from "express";
import router from "./route/route";
import cookieParser from "cookie-parser";
import cors from "cors";
export const createApp = (): Express => {
  const app = express();
  app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://stfxno1.vercel.app",
      "https://f4bff1c76c84.ngrok-free.app"
    ],
    credentials: true,
  })
);
  app.use(express.json());
    app.get("/", (req: Request, res: Response) => {
    res.send("Server is running");
  });
  app.use("/api", router);
  return app;
};