import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TWallet } from "@/lib/types";
import { FC } from "react";
import { RiWalletFill } from "react-icons/ri";
import { FaPiggyBank } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

type WalletCardProps = Pick<TWallet, "_id" | "name" | "isSaving"> & { balance: number; membersCount: number };
export const WalletCard: FC<WalletCardProps> = ({ name, isSaving, membersCount, balance }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className="from-primary/80 to-primary flex size-10 items-center justify-center rounded-md bg-gradient-to-bl">
          <RiWalletFill className="size-6 text-white/80" />
        </div>

        <div className="space-y-3">
          <CardTitle>{name}</CardTitle>
          <div className="flex items-center gap-2">
            {isSaving && <SavingBadge />}
            {membersCount + 1 && <MembersBadge count={membersCount + 2} />}
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent>
      <div className="dark:bg-background bg-background-gray flex items-center justify-between gap-6 rounded-md p-4">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Current Balance</p>
          <h3 className="text-3xl font-semibold">$ {balance}</h3>
        </div>

        <FaMoneyBillTrendUp className="size-5" />
      </div>
    </CardContent>
  </Card>
);

const SavingBadge = () => (
  <Badge className="text-primary bg-primary/20 gap-2 font-semibold">
    <FaPiggyBank /> Saving
  </Badge>
);
const MembersBadge: FC<{ count: number }> = ({ count }) => (
  <Badge variant="outline">
    <HiUsers />
    {count}
    <span>{count > 1 ? "members" : "member"}</span>
  </Badge>
);
