"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useUserStore } from "./userStore";
import MessageForm from "./MessageForm";
import ChatBubble from "./ChatBubble";
import { useMessageStore } from "./messageStore";
import { useSocketStore } from "./socketStore";

let sampleMessages = [
  {
    messageId: "1fahsdlfjl",
    message: "Hello",
    senderId: "1",
    senderName: "1",
    receiverId: null,
    roomId: null,
    timestamp: null,
    delivered: false,
    read: false,
  },
  {
    messageId: "2fahsdlfjl",
    message: "Hi",
    senderId: "other",
    senderName: "Saima",
    receiverId: null,
    roomId: null,
    timestamp: null,
    delivered: false,
    read: false,
  },
  {
    messageId: "3fahsdlfjl",
    message: "This is a Chat System",
    senderId: "other",
    senderName: "Saima",
    receiverId: null,
    roomId: null,
    timestamp: null,
    delivered: false,
    read: false,
  },
  {
    messageId: "4fahsdlfjl",
    message: "and It's very clean",
    senderId: "other",
    senderName: "Saima",
    receiverId: null,
    roomId: null,
    timestamp: null,
    delivered: false,
    read: false,
  },
  {
    messageId: "5fahsdlfjl",
    message: "Easy understand code and best practices",
    senderId: "1",
    senderName: "1",
    receiverId: null,
    roomId: null,
    timestamp: null,
    delivered: false,
    read: false,
  },
];

export default function page() {
  const { user: clerkUser } = useUser();
  const setUser = useUserStore((state) => state.setUser);
  const setMessages = useMessageStore((state) => state.setMessages);
  const connectSocket = useSocketStore((state) => state.connect);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  // todo better way to load the cleark user
  // remove sample message data
  useEffect(() => {
    if (clerkUser) {
      setUser({
        userId: clerkUser.id,
        fullName: clerkUser.fullName ?? "",
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        accountCreated: clerkUser.createdAt
          ? new Date(clerkUser.createdAt).toISOString()
          : null,
        lastSignIn: clerkUser.lastSignInAt
          ? new Date(clerkUser.lastSignInAt).toISOString()
          : null,
      });
      setMessages(
        sampleMessages.map((message) => {
          if (message.senderId === "1") message.senderId = clerkUser.id;
          return message;
        })
      );
    }
  }, [clerkUser, setUser]);

  const messages = useMessageStore((state) => state.messages);
  if (!useUserStore((state) => state.user))
    return <div>loading userState...</div>;

  return (
    <div className="bg-slate-800 h-svh text-white flex flex-col">
      <div className="flex-1 overflow-auto">
        {messages.map((message) => (
          <ChatBubble key={message.messageId} message={message} />
        ))}
      </div>
      <MessageForm />
    </div>
  );
}
