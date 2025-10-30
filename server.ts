import * as http from "http";
import { Server } from "socket.io";
import { CONFIG } from "./config/config";
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
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
