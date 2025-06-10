import { create } from "zustand";
import { useSocketStore } from "./socketStore";

export type Message = {
  messageId: string | null;
  message: string;
  senderId: string;
  senderName: string;
  receiverId: string | null;
  roomId: string | null;
  timestamp: string | null;
  delivered: boolean;
  read: boolean;
};

type MessageStore = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, update: Partial<Message>) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages: Message[]) => set({ messages }),
  addMessage: (message: Message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, update) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.messageId === id ? { ...message, ...update } : message
      ),
    })),
}));

export const parseMessage = (data: any): Message => {
  return {
    messageId: data.messageId,
    message: data.message,
    senderId: data.senderId,
    senderName: data.senderName,
    receiverId: data.receiverId ?? null,
    roomId: data.roomId ?? null,
    timestamp: String(data.timestamp),
    delivered: !!data.delivered,
    read: !!data.read,
  };
};
