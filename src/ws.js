import initUser from "./controllers/initUser.js";
import authUser from "./controllers/authUser.js";
import userToServerMessage from "./controllers/userToServerMessage.js";
import fetchAllUsers from "./controllers/fetchAllUsers.js";
import fetchMessages from "./controllers/findChatBetweenUsers.js";

const onlineUsers = new Map();

export default function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("initUser", async (userData, callback) => {
      if (onlineUsers.has(userData.userId)) return;
      onlineUsers.set(userData.userId, socket.id);
      console.log("==================== Connected ====================");
      console.log(`fullName: ${userData.fullName}`);
      console.log(`userId: ${userData.userId}`);
      console.log(`socket.id: ${socket.id}`);
      console.log("===================================================");
      socket.userId = userData.userId; // Store userId on the socket for easy removal
      callback(await initUser(userData));
    });

    socket.on("fetchAllUsers", async (userData, callback) =>
      callback(await fetchAllUsers(userData))
    );

    socket.on("userToServerMessage", async (message, callback) => {
      const response = await userToServerMessage(message);
      const receiverSocketId = onlineUsers.get(message.receiverId);
      if (receiverSocketId && io.sockets.sockets.get(receiverSocketId)) {
        io.to(receiverSocketId).emit("serverToUserMessage", response);
      }
      callback(response);
    });

    socket.on("fetchMessages", async (userA, userB, callback) =>
      callback(await fetchMessages(userA, userB))
    );

    socket.on("authUser", (token, userId, callback) =>
      callback(authUser(token, userId))
    );

    socket.on("onlineIndicator", (userId, callback) =>
      callback(onlineIndicator(userId))
    );

    socket.on("disconnect", () => {
      if (socket.userId) onlineUsers.delete(socket.userId);
      console.log("=================== Disconnected ==================");
      console.log(`userId: ${socket.userId}`);
      console.log(`socket.id: ${socket.id}`);
      console.log("===================================================");
    });
  });
}
