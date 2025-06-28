import { ArrowUpDown, Grid3x3Icon, Wallet } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavItems = () => {
  const pathname = usePathname();

  const navItems = useMemo(() => {
    const isActive = (url: string) => pathname.startsWith(url);

    return [
      { title: "Dashboard", url: "/", icon: Grid3x3Icon, isActive: pathname === "/" },
      { title: "Wallets", url: "/wallets", icon: Wallet, isActive: isActive("/wallets") },
      { title: "Transactions", url: "/transactions", icon: ArrowUpDown, isActive: isActive("/transactions") },
    ];
  }, [pathname]);

  return { navItems };
};
