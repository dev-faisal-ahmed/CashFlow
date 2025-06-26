import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type CommonAvatarProps = { name: string; src?: string; size?: "SM" | "MD" | "LG" };

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

export const CommonAvatar = ({ name = "", src, size = "MD" }: CommonAvatarProps) => {
  const config = CONFIG[size];

  return (
    <Avatar className={config.avatarClassNae}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback className="text-lg font-bold">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
};
