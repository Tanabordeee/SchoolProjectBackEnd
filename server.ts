import * as http from "http";
import { Server } from "socket.io";
import { CONFIG } from "./config/config";
import { Coordinates } from "./types/type";
import { createApp } from "./app";
import { registerSocketEvents } from "./socket";

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://stfxno1.vercel.app",
      "https://f4bff1c76c84.ngrok-free.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
registerSocketEvents(io);
server.listen(CONFIG.PORT, () => {
  console.log(`Server running at http://localhost:${CONFIG.PORT}`);
});
// npx ts-node server.ts