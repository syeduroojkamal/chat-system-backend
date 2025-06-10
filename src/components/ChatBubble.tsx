import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Check, CheckCheck, User } from "lucide-react";

export type ChatBubbleProps = {
  id: number;
  content: string;
  sender: "self" | "other";
  timestamp: string;
  read: boolean;
  avatar?: string;
  name?: string;
};

const ChatBubble = React.memo(function ChatBubble({
  id,
  content,
  sender,
  timestamp,
  read = false,
  avatar,
  name = "Member",
}: ChatBubbleProps) {
  const isSelf = sender === "self";

  // Format timestamp to HH:MM
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  if (isSelf) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex max-w-[80%] flex-row-reverse">
          <div className="flex flex-col items-end mr-2">
            <div className="rounded-2xl px-4 py-2 bg-primary text-white shadow-sm">
              <p className="text-sm">{content}</p>
            </div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <span>{formatTime(timestamp)}</span>
              <span className="ml-1">
                {read ? (
                  <CheckCheck size={14} className="text-primary" />
                ) : (
                  <Check size={14} />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For "other"
  return (
    <div className="flex justify-start mb-4">
      <div className="flex max-w-[80%]">
        <Avatar className="h-8 w-8 mr-2">
          {avatar ? (
            <AvatarImage src={avatar} alt={name || "User" + id} />
          ) : (
            <AvatarFallback>
              <User />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col items-start ml-2">
          {name ? (
            <span className="text-sm font-bold text-foreground mb-1">
              {name}
            </span>
          ) : null}
          <div className="rounded-2xl px-4 py-2 bg-muted text-foreground border border-border shadow-sm">
            <p className="text-sm">{content}</p>
          </div>
          <div className="flex items-center mt-1 text-xs text-muted-foreground">
            <span>{formatTime(timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ChatBubble;
