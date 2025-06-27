import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

type CommonAvatarProps = { name: string; src?: string; size?: "SM" | "MD" | "LG"; fallbackClassName?: string };

const CONFIG = {
  SM: { avatarClassNae: "size-10" },
  MD: { avatarClassNae: "size-12" },
  LG: { avatarClassNae: "size-16" },
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
};

export const CommonAvatar: FC<CommonAvatarProps> = ({ name = "", src, size = "MD", fallbackClassName }) => {
  const config = CONFIG[size];

  return (
    <Avatar className={config.avatarClassNae}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback className={cn("text-lg font-bold", fallbackClassName)}>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
};
