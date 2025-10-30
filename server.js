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
var io = new socket_io_1.Server(server, {
    cors: {
        origin: `${process.env.CLIENT_ORIGIN}`,
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


