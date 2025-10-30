"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var socket_io_1 = require("socket.io");
// Create an HTTP server that responds on '/' so Render can detect an open HTTP port
var server = http.createServer(function (req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("OK\n");
});
var allowedOrigins = [
    "https://school-project-front-i5ajugf66-tanabordees-projects.vercel.app",
    "https://school-project-front-2fk7hvhro-tanabordees-projects.vercel.app",
    "https://school-project-front-end-ruddy.vercel.app",
    "https://school-project-front-end-zh5m.vercel.app"
];
var io = new socket_io_1.Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin)
                return callback(null, true);
            var normalized = origin.replace(/\/$/, "");
            if (allowedOrigins.includes(normalized))
                return callback(null, true);
            return callback(new Error("Socket.IO CORS blocked: ".concat(origin)));
        },
        credentials: true
    }
});
var userLocation = {};
io.on("connect", function (socket) {
    console.log("User connected", socket.id);
    socket.on("update_location", function (_a) {
        var lat = _a.lat, lng = _a.lng;
        userLocation[socket.id] = { lat: lat, lng: lng };
        socket.emit("location", { lat: lat, lng: lng });
    });
    socket.on("disconnect", function () {
        console.log("User disconnected:", socket.id);
        delete userLocation[socket.id]; // ลบข้อมูลผู้ใช้นั้น
    });
});
const PORT = parseInt(process.env.PORT || "3000", 10);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


