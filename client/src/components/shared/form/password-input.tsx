import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ComponentProps, useState } from "react";

type PasswordInputProps = ComponentProps<"input">;

export const PasswordInput = ({ ...props }: PasswordInputProps) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={showPass ? "text" : "password"} />
      <button
        type="button"
        className="absolute top-1/2 right-3 z-10 -translate-y-1/2 cursor-pointer"
        onClick={() => setShowPass((prev) => !prev)}
      >
        {showPass ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
      </button>
    </div>
  );
};
