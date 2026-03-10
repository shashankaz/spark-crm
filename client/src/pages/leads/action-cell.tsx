import { useState } from "react";
import { useNavigate } from "react-router";
import { EllipsisVertical, Pencil, Trash2, UserCheck } from "lucide-react";
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
import { AssignLeadModal } from "./assign-lead-modal";

import { useDeleteLead, useAssignLead, useUser } from "@/hooks";

import type { Lead } from "@/types/domain";

export const ActionCell = ({ lead }: { lead: Lead }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const navigate = useNavigate();

  const { user } = useUser();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteLead();
  const { mutate: assignMutate, isPending: isAssigning } = useAssignLead();

  const deleteLead = () => {
    deleteMutate(
      { id: lead._id },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
        onSettled: () => {
          setDeleteOpen(false);
        },
      },
    );
  };

  const assignLead = (assignedUserId: string) => {
    assignMutate(
      { id: lead._id, assignedUserId },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          setAssignOpen(false);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  const isPending = isDeleting || isAssigning;

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
            onClick={() => navigate(`/dashboard/leads/${lead._id}/edit`)}
            disabled={isPending}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setAssignOpen(true)}
                disabled={isPending}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Assign to User
              </DropdownMenuItem>
            </>
          )}

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
        onConfirm={deleteLead}
        placeholder="lead"
      />

      {isAdmin && (
        <AssignLeadModal
          open={assignOpen}
          onOpenChange={setAssignOpen}
          onConfirm={assignLead}
          isPending={isAssigning}
        />
      )}
    </>
  );
};
