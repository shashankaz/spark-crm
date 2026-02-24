import { useState } from "react";
import { useNavigate } from "react-router";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteDialog } from "@/components/shared/dashboard/delete-dialog";

import { useDeleteOrganization } from "@/hooks/use-organization";

import type { Organization } from "@/types";

export const ActionCell = ({
  organization,
}: {
  organization: Organization;
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteOrganization();

  const deleteOrganization = () => {
    mutate(
      { id: organization._id },
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
            onClick={() =>
              navigate(`/dashboard/organizations/${organization._id}/edit`)
            }
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
        onConfirm={deleteOrganization}
        placeholder="organization"
      />
    </>
  );
};
