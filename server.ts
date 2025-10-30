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
    origin: CONFIG.CLIENT_ORIGIN,
    credentials: true,
  },
});
registerSocketEvents(io);
server.listen(CONFIG.PORT, () => {
  console.log(`Server running at ${CONFIG.PORT}`);
});
// npx ts-node server.ts