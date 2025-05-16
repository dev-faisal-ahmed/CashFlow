import { Input } from "@/components/ui/input";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { ComponentProps, useState } from "react";

type PasswordInputProps = ComponentProps<"input">;

export const PasswordInput = ({ ...props }: PasswordInputProps) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={showPass ? "text" : "password"} />
      <button type="button" className="absolute top-1/2 right-2 -translate-y-1/2" onClick={() => setShowPass((prev) => !prev)}>
        {showPass ? <EyeClosedIcon size={16} /> : <EyeIcon size={16} />}
      </button>
    </div>
  );
};
