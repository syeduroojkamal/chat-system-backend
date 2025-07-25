import initUser from "./controllers/initUser.js";
import refetchUser from "./controllers/refetchUser.js";
import authUser from "./controllers/authUser.js";
import userToServerMessage from "./controllers/userToServerMessage.js";
import fetchAllUsers from "./controllers/fetchAllUsers.js";
import fetchMessages from "./controllers/findChatBetweenUsers.js";
import addFriends from "./controllers/addFriends.js";
import fetchFriendsDetails from "./controllers/fetchFriendsDetails.js";
import unfriend from "./controllers/unfriend.js";

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

    socket.on("refetchUser", async (userId, callback) => {
      callback(await refetchUser(userId));
    });

    socket.on("fetchAllUsers", async (userData, callback) =>
      callback(await fetchAllUsers(userData))
    );

    socket.on("userToServerMessage", async (message, callback) => {
      const receiverSocketId = onlineUsers.get(message.receiverId);
      const isOnline =
        receiverSocketId && io.sockets.sockets.get(receiverSocketId);
      let response;
      if (isOnline) {
        message.read = true;
        response = await userToServerMessage(message);
        io.to(receiverSocketId).emit("serverToUserMessage", response);
      } else {
        response = await userToServerMessage(message);
      }

      callback(response);
    });

    socket.on("fetchMessages", async (userA, userB, callback) => {
      const SenderSocketId = onlineUsers.get(userB.userId);
      const isOnline = SenderSocketId && io.sockets.sockets.get(SenderSocketId);
      if (isOnline) {
        io.to(SenderSocketId).emit("markMessageReceived");
      }
      callback(await fetchMessages(userA, userB));
    });

    socket.on("authUser", (token, userId, callback) =>
      callback(authUser(token, userId))
    );

    socket.on("onlineIndicator", (userId, callback) =>
      callback(onlineIndicator(userId))
    );

    socket.on("fetchFriendsDetails", async (friendIdArr, callback) => {
      callback(await fetchFriendsDetails(friendIdArr));
    });

    socket.on("addFriends", async (userIds, callback) => {
      const myUserId = socket.userId;
      callback(await addFriends(myUserId, userIds));
    });

    socket.on("unfriend", async (myUserId, friendId, callback) => {
      callback(await unfriend(myUserId, friendId));
    });

    socket.on("disconnect", () => {
      if (socket.userId) onlineUsers.delete(socket.userId);
      console.log("=================== Disconnected ==================");
      console.log(`userId: ${socket.userId}`);
      console.log(`socket.id: ${socket.id}`);
      console.log("===================================================");
    });
  });
}
