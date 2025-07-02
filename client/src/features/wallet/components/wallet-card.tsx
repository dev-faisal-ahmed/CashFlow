import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TWallet } from "@/lib/types";
import { RiWalletFill } from "react-icons/ri";

type WalletCardProps = Pick<TWallet, "_id" | "name" | "isSaving">;

export const WalletCard = ({ name }: WalletCardProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className="from-primary/70 to-primary flex size-10 items-center justify-center rounded-md bg-gradient-to-bl">
          <RiWalletFill className="size-6 text-white/80" />
        </div>
        <CardTitle>{name}</CardTitle>
      </div>
    </CardHeader>
  </Card>
);
