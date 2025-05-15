import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const CONFIG = {
  SM: { avatarClassNae: "size-8" },
  MD: { avatarClassNae: "size-10" },
  LG: { avatarClassNae: "size-12" },
};

type CommonAvatarProps = { name: string; src?: string; size?: "SM" | "MD" | "LG" };

export const CommonAvatar = ({ name, src, size = "MD" }: CommonAvatarProps) => {
  const config = CONFIG[size];

  return (
    <Avatar className={config.avatarClassNae}>
      {src && <AvatarImage src={src} />}
      <AvatarFallback className="text-xl font-bold">{name.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};
