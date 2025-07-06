import { ArrowUpDown, Grid3x3Icon, Plug2Icon, WalletIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavItems = () => {
  const pathname = usePathname();

  const navItems = useMemo(() => {
    const isActive = (url: string) => pathname.startsWith(url);

    return [
      { title: "Dashboard", url: "/", icon: Grid3x3Icon, isActive: pathname === "/" },
      { title: "Wallets", url: "/wallets", icon: WalletIcon, isActive: isActive("/wallets") },
      { title: "Sources", url: "/sources", icon: Plug2Icon, isActive: isActive("/sources") },
      { title: "Transactions", url: "/transactions", icon: ArrowUpDown, isActive: isActive("/transactions") },
    ];
  }, [pathname]);

  return { navItems };
};
