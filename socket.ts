import { Server, Socket } from "socket.io";
import { CONFIG } from "./config/config";
import { Coordinates } from "./types/type";
import { LocationEvent } from "./types/type";
import { getDistanceInMeters } from "./utils/util";

interface UserInfo {
  id: string;          // user id
  nickname ?: string;
  admit?:boolean;
  role: "teacher" | "parent" | "student";
  studentIds?: string[]; // ถ้าเป็น parent: list ลูก
}
export function registerSocketEvents(io: Server) {
  const userLocations: Record<string, Coordinates> = {};
  const userInfos: Record<string, UserInfo> = {};
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join" , (info : UserInfo)=>{
      console.log("join", info);
      userInfos[socket.id] = info
      if(info.role === "teacher") socket.join("all_users")
      else if(info.role === "student") socket.join(`student_${info.id}`)
      else if(info.role === "parent") info.studentIds?.forEach((sid) => socket.join(`student_${sid}`))
      socket.emit("joined_ack");
      })
    
    socket.on("update_location", ({ lat, lng }: LocationEvent) => {
      const info = userInfos[socket.id]

      const location = { lat, lng };
      userLocations[socket.id] = location;

      
      const distance = getDistanceInMeters(location, CONFIG.CENTER);
      const insideZone = distance <= CONFIG.RADIUS;

      console.log(
        `User ${socket.id} ${insideZone ? "อยู่ในเขต" : "นอกเขต"} (${distance.toFixed(2)} m)`
      );

      socket.emit("location_status", { inside: insideZone, distance });
      if(info.role === "parent" || info.role === "teacher"){
        console.log(info.studentIds)
          io.to("all_users").emit("user_location", { id: info.id, role: info.role, lat, lng , insideZone , distance , students:info.studentIds});
      }
      if(info.role === "parent" || info.role === "student"){
          const msg = insideZone ? "คุณเข้ามาในรัศมีแล้ว" : "คุณอยู่ข้างนอกรัศมี";
          info.studentIds?.forEach(sid => {
            io.to(`student_${sid}`).emit("parent_location_update", { parentId: info.id, lat, lng, insideZone , distance , message:msg});
          });
          socket.emit("parent_location_update", {
            parentId: info.id,
            lat,
            lng,
            insideZone,
            distance,
            message: msg,
          });
      }

      if(info.role === "student"){
        io.to(`student_${info.id}`).emit("student_location_update", {studentID: info.id , nickname:info.nickname, lat , lng , admit: info.admit})
      }
    });
    socket.on("student_status", ({ admit }: { admit: boolean }) => {
      const info = userInfos[socket.id];
      if (!info || info.role !== "student") return;
    
      
      info.admit = admit;
    
      io.to(`student_${info.id}`).emit("student_location_update", {
        studentID: info.id,
        nickname: info.nickname,
        lat: userLocations[socket.id]?.lat,
        lng: userLocations[socket.id]?.lng,
        admit: info.admit,
      });
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      delete userInfos[socket.id];
      delete userLocations[socket.id];
    });
  });
}
