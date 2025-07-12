import { DeleteDialog } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { useDeleteSource } from "../source-hook";

type DeleteSourceProps = { sourceId: string };
export const DeleteSource = ({ sourceId }: DeleteSourceProps) => {
  const { open, onOpenChange, handleDelete, mutationKey } = useDeleteSource(sourceId);

  return (
    <>
      <Button variant="destructive_ghost" className="w-full justify-start" onClick={() => onOpenChange(true)}>
        <Trash2Icon /> Delete Source
      </Button>

      <DeleteDialog open={open} onOpenChange={onOpenChange} mutationKey={mutationKey} onDelete={handleDelete} />
    </>
  );
};
