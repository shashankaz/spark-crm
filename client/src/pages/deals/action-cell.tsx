import { useState } from "react";
import { useNavigate } from "react-router";
import { EllipsisVertical, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteDialog } from "@/components/shared/dashboard/delete-dialog";

import { useDeleteDeal } from "@/hooks";

import type { IDeal } from "@/types/domain";

export const ActionCell = ({ deal }: { deal: IDeal }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteDeal();

  const deleteDeal = () => {
    mutate(
      { id: deal._id },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setDeleteOpen(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={isPending}
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => navigate(`/dashboard/deals/${deal._id}/edit`)}
            disabled={isPending}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-error focus:text-error"
            onClick={() => setDeleteOpen(true)}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4 text-error" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={deleteDeal}
        placeholder="deal"
      />
    </>
  );
};
