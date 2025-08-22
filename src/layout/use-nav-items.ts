import { ArrowUpDown, Grid3x3Icon, Plug2Icon, UsersIcon, WalletIcon } from "lucide-react";
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
      { title: "Contacts", url: "/contacts", icon: UsersIcon, isActive: isActive("/contacts") },
      {
        title: "Transactions",
        icon: ArrowUpDown,
        isActive: isActive("/transactions"),
        items: [
          { title: "Regular", url: "/transactions/regular", isActive: isActive("/transactions/regular") },
          { title: "Borrow", url: "/transactions/borrow", isActive: isActive("/transactions/borrow") },
        ],
      },
    ];
  }, [pathname]);

  return { navItems };
};
