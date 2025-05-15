import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { IoWallet } from "react-icons/io5";

// Font
const font = Poppins({ weight: "600" });

// Config
const CONFIG = {
  SM: { iconClassName: "size-5", textClassName: "text-lg" },
  MD: { iconClassName: "size-8", textClassName: "text-2xl" },
  LG: { iconClassName: "size-12", textClassName: "text-2xl" },
};

// Main Component
type AppLogoProps = { className?: string; size?: "SM" | "MD" | "LG" };

export const AppLogo = ({ className, size = "MD" }: AppLogoProps) => {
  const config = CONFIG[size];
  return (
    <div className={cn("flex items-center gap-2 antialiased", font.className, className)}>
      <IoWallet className={config.iconClassName} />
      <h1 className={cn("font-bold tracking-tight", config.textClassName)}>Cash Flow</h1>
    </div>
  );
};
