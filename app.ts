import express, { Express } from "express";
import router from "./route/route";
import cors from "cors";
import cookieParser from "cookie-parser";

export const createApp = (): Express => {
  const app = express();

  app.use(cookieParser());

  app.use(
    cors({
      origin: "https://school-project-front-i5ajugf66-tanabordees-projects.vercel.app/", // 👈 URL ของ frontend ที่ deploy แล้ว
      credentials: true, // เพื่อส่ง cookie / auth
    })
  );

  app.use(express.json());
  app.use("/api", router);

  return app;
};
