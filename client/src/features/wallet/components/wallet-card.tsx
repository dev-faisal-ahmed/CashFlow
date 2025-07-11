import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TWallet } from "@/lib/types";
import { RiWalletFill } from "react-icons/ri";
import { FaPiggyBank } from "react-icons/fa";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { ActionMenu } from "@/components/shared";
import { usePopupState } from "@/lib/hooks";
import { UpdateWallet } from "./update-wallet";
import { DeleteWallet } from "./delete-wallet";
import { WalletTransfer } from "./wallet-transfer";

type WalletCardProps = Pick<TWallet, "_id" | "name" | "isSaving"> & { balance: number };
export const WalletCard: FC<WalletCardProps> = ({ _id, name, isSaving, balance }) => {
  const { open, onOpenChange } = usePopupState();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="from-primary/80 to-primary flex size-14 items-center justify-center rounded-md bg-gradient-to-bl">
            <RiWalletFill className="size-8 text-white/80" />
          </div>

          <div className="flex flex-col gap-2">
            <CardTitle>{name}</CardTitle>
            {isSaving && <SavingBadge />}
          </div>
          <ActionMenu open={open} onOpenChange={onOpenChange} triggerClassName="ml-auto">
            <UpdateWallet name={name} isSaving={isSaving} walletId={_id} onSuccess={() => onOpenChange(false)} />
            <WalletTransfer balance={balance} walletId={_id} onSuccess={() => onOpenChange(false)} />
            <DeleteWallet walletId={_id} />
          </ActionMenu>
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
};

const SavingBadge = () => (
  <Badge className="text-primary bg-primary/20 gap-2 text-xs font-semibold">
    <FaPiggyBank /> Saving
  </Badge>
);
