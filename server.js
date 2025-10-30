"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var socket_io_1 = require("socket.io");
var server = http.createServer();
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
server.listen(3000, function () {
    console.log("✅ Server is running on http://localhost:3000");
});
