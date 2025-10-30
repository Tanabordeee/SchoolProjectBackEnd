// app.ts
import express, { Express } from "express";
import router from "./route/route";
import cookieParser from "cookie-parser";

export const createApp = (): Express => {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.status(200).send("OK");
  });

  app.use("/api", router);

  return app;
};
