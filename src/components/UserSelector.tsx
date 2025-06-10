import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { User } from "lucide-react";
import { Card } from "./ui/card";
import Link from "next/link";

type UserSelectorProps = {
  id: string;
  name: string;
};

export default function UserSelector({ id, name }: UserSelectorProps) {
  return (
    <Link href={`/chats/${id}`}>
      <Card className="flex-row items-center">
        <Avatar className="h-12 w-12 ml-4">
          <AvatarImage src="" alt="@shadcn" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-1">
          <p className="text-xl leading-none">{name}</p>
          <p className="text-sm text-muted-foreground">Last Message</p>
        </div>
      </Card>
    </Link>
  );
}
