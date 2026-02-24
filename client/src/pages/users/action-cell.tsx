import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteDialog } from "@/components/shared/dashboard/delete-dialog";

import { deleteUser } from "@/api/services/user.service";
import type { User } from "@/types";

export const ActionCell = ({ user }: { user: User }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteUser({ id }),
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setDeleteOpen(false);
    },
  });

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
            onClick={() => navigate(`/dashboard/users/${user._id}/edit`)}
            disabled={isPending}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-error focus:text-error"
            onClick={() => setDeleteOpen(true)}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          handleDelete({ id: user._id });
        }}
        placeholder="user"
      />
    </>
  );
};
