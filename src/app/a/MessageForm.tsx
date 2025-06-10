"use client";

import { useState, useCallback } from "react";
import { useUserStore } from "./userStore";
import { Message } from "./messageStore";
import { userToServerMessage, useSocketStore } from "./socketStore";

export default function MessageForm() {
  const userState = useUserStore((state) => state.user);
  if (!userState) return <p>Loading userState...</p>;

  const [message, setMessage] = useState<Message>({
    message: "",
    senderId: userState.userId,
    senderName: userState.fullName,
    receiverId: null,
    roomId: null,
    messageId: null,
    timestamp: null,
    delivered: false,
    read: false,
  });

  const socket = useSocketStore((state) => state.socket);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const trimmed = message.message.trim();
      if (!trimmed) return;
      userToServerMessage({ ...message, message: trimmed });
      setMessage({ ...message, message: "" });
    },
    [message, socket]
  );

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700 p-4 flex gap-4">
      <input
        type="text"
        className="grow bg-white text-black px-2"
        value={message.message}
        onChange={(e) => setMessage({ ...message, message: e.target.value })}
        placeholder="Type your message..."
        aria-label="Message input"
      />
      <button
        type="submit"
        disabled={!message.message.trim()}
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}
