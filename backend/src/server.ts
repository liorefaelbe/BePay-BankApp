import http from "http";
import app from "./app";
import { initSocket } from "./socket";
import { connectDB } from "./config/db";

const PORT = 4000;

const server = http.createServer(app);

// Initialize WebSocket
initSocket(server);
// Connect to Database
connectDB();
// Start Server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
