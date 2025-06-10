"use client";
import { Message } from "./messageStore";
import { useUserStore } from "./userStore";

export default function ChatBubble({ message }: { message: Message }) {
  const userState = useUserStore((state) => state.user);
  if (!userState) return <p>Loading userState...</p>;

  if (userState.userId === message.senderId) {
    return (
      <div className={`flex justify-end mb-2`}>
        <div className="rounded-lg px-4 py-2 max-w-xs break-words bg-blue-600 text-white">
          {message.message}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-start mb-2`}>
      <div className="rounded-lg px-4 py-2 max-w-xs break-words bg-slate-600 text-white">
        {message.message}
      </div>
    </div>
  );
}
