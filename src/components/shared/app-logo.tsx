import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { FC } from "react";
import { IoWallet } from "react-icons/io5";

// Font
const font = Poppins({ subsets: ["latin"], weight: "600" });

// Main Component
type AppLogoProps = { containerClassname?: string; descriptionClassName?: string };

export const AppLogo: FC<AppLogoProps> = ({ containerClassname, descriptionClassName }) => (
  <div className={cn("flex h-16 items-center gap-2 antialiased", font.className, containerClassname)}>
    <span className="bg-primary flex size-10 items-center justify-center rounded-md text-white">
      <IoWallet className="size-6" />
    </span>
    <div>
      <h1 className={cn("font-bold tracking-tight")}>Cash Flow</h1>
      <p className={cn("text-muted-foreground text-xs", descriptionClassName)}>Smart Finance</p>
    </div>
  </div>
);
