import { Server } from "socket.io";

let io: Server;

// Initialize WebSocket server, attaching it to the existing HTTP server
// and setting up event handlers. on port 4000 ip localhost
export function initSocket(server: any) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("register", (email: string) => {
      socket.join(email);
      console.log(`Socket ${socket.id} joined room ${email}`);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

// Notify user via WebSocket
export function notifyUser(email: string, payload: any) {
  if (io) {
    io.to(email).emit("notification", payload);
  }
}
