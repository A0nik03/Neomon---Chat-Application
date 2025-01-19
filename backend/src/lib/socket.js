import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:['http://localhost:5173'],
    }
});

export function GetReceiverSocketId(userId){
    return userSocketMap[userId];
}

// Use to Store Online Users
const userSocketMap = {}; //{UserId: socketId}

io.on('connection',(socket) => {
    console.log('user connected',socket.id);

    const userId = socket.handshake.query.userId;

    if(userId) userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit('GetOnlineUsers',Object.keys(userSocketMap))

    socket.on('disconnect',()=>{
        console.log('user disconnected',socket.id);
        delete userSocketMap[userId];
        io.emit('GetOnlineUsers',Object.keys(userSocketMap))
    })
})

export {io,app,server};
