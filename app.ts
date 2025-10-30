import express, { Express } from "express";
import router from "./route/route";
import cors from "cors";
import cookieParser from "cookie-parser";

export const createApp = (): Express => {
  const app = express();

  app.use(cookieParser());

  const allowedOrigins = [
    "https://school-project-front-i5ajugf66-tanabordees-projects.vercel.app",
    "https://school-project-front-2fk7hvhro-tanabordees-projects.vercel.app",
    "https://school-project-front-end-ruddy.vercel.app",
    "https://school-project-front-end-zh5m.vercel.app"
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow server-to-server and curl
        const normalized = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(normalized)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS blocked: ${origin}`));
      },
      credentials: true,
    })
  );

  app.use(express.json());
  app.get("/", (_req, res) => {
    res.status(200).send("OK");
  });
  app.use("/api", router);

  return app;
};
