// server.ts
import * as http from "http";
import { Server } from "socket.io";
import { createApp } from "./app";
import { registerSocketEvents } from "./socket";

const app = createApp();
const server = http.createServer(app);

// สร้าง Socket.IO server โดยไม่ตั้ง CORS เลย
const io = new Server(server);

registerSocketEvents(io);

const PORT = parseInt(process.env.PORT || "3000", 10);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
