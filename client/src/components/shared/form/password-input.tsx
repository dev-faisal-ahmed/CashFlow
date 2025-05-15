import { Input } from "@/components/ui/input";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { ComponentProps, useState } from "react";

type PasswordInputProps = ComponentProps<"input">;

export const PasswordInput = ({ ...props }: PasswordInputProps) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={showPass ? "text" : "password"} />
      <button onClick={() => setShowPass((prev) => !prev)}>{showPass ? <EyeClosedIcon /> : <EyeIcon />}</button>
    </div>
  );
};
