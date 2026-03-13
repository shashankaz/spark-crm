import { useState } from "react";
import { useNavigate } from "react-router";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
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

import { useDeleteContact } from "@/hooks";

import type { IContact } from "@/types/domain";

export const ContactActionCell = ({ contact }: { contact: IContact }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteContact();

  const handleDelete = () => {
    deleteMutate(
      { id: contact._id },
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
            disabled={isDeleting}
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => navigate(`/dashboard/contacts/${contact._id}/edit`)}
            disabled={isDeleting}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-error focus:text-error"
            onClick={() => setDeleteOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4 text-error" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        placeholder="contact"
      />
    </>
  );
};
