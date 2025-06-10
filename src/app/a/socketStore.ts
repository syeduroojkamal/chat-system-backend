import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { Message, parseMessage, useMessageStore } from "./messageStore";

const webSocketServer = "http://localhost:3001";

type SocketStore = {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  connect: () => {
    if (!get().socket) {
      try {
        const socket = io(webSocketServer, { transports: ["websocket"] }); // force websocket no fallbacks
        set({ socket });
      } catch (error) {
        console.error("Socket connection error:", error);
      }
    }
  },
  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      try {
        socket.removeAllListeners();
        socket.disconnect();
      } catch (error) {
        console.error("Socket disconnection error:", error);
      }
      set({ socket: null });
    }
  },
}));

export const userToServerMessage = (message: Message) => {
  const socket = useSocketStore.getState().socket;
  try {
    socket?.emit(
      "userToServerMessage",
      message,
      (response: { success: boolean; message: string; data?: Message }) => {
        if (response.success) {
          useMessageStore.getState().addMessage(parseMessage(response.data));
        } else {
          console.error("Server : ", response);
        }
      }
    );
  } catch (error) {
    console.error("userToServerMessage = ", error);
  }
};
