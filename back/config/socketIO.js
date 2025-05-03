const { Server } = require("socket.io");

let io;
const userSocketMap = {};
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",//["http://localhost:5173"], // Allow connections from these frontend URLs
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  //each user login we automatically add this id and socket.id to the map 
  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      userSocketMap[userId.user_id] = socket.id;
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
      console.log(userSocketMap);
    });
    //before disconnect we need to remove that user from the userSocketMap
    socket.on('disconnect', () => {
      for (const [userId, id] of Object.entries(userSocketMap)) {
        if (id === socket.id) {
          delete userSocketMap[userId];
          break;
        }
      }
    });


  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}

module.exports = { initSocket, getIO, userSocketMap };

// const { getIO, userSocketMap } = require("./path/to/your/socketFile");

// // Then you can emit like this:
// getIO().emit("someEvent", { some: "data" });

// // Or emit to a specific user like this:
// const socketId = userSocketMap[userId];
// if (socketId) {
//   getIO().to(socketId).emit("privateMessage", { message: "Hello" });
// }