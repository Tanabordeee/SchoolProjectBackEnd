import * as http from "http";
import { Server } from "socket.io";
import { CONFIG } from "./config/config";
import { createApp } from "./app";
import { registerSocketEvents } from "./socket";

const app = createApp();
const server = http.createServer(app);

const allowedOrigins = [
  "https://school-project-front-i5ajugf66-tanabordees-projects.vercel.app",
  "https://school-project-front-2fk7hvhro-tanabordees-projects.vercel.app",
  "https://school-project-front-end-ruddy.vercel.app",
  "https://school-project-front-end-zh5m.vercel.app",
];

const io = new Server(server, {
  cors: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalized)) return callback(null, true);
      return callback(new Error(`Socket.IO CORS blocked: ${origin}`));
    },
    credentials: true,
  },
});

registerSocketEvents(io);
const PORT = parseInt(process.env.PORT || "3000", 10);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
