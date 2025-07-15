import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

type CommonAvatarProps = { name: string; src?: string; size?: "SM" | "MD" | "LG"; fallbackClassName?: string; containerClassName?: string };

const CONFIG = {
  SM: { avatarClassName: "size-10" },
  MD: { avatarClassName: "size-12" },
  LG: { avatarClassName: "size-16" },
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2);
};

export const CommonAvatar: FC<CommonAvatarProps> = ({ name = "", src, size = "MD", fallbackClassName, containerClassName }) => {
  const config = CONFIG[size];

  return (
    <Avatar className={cn("rounded-md", config.avatarClassName, containerClassName)}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback className={cn("rounded-md text-lg font-bold", fallbackClassName)}>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
};
