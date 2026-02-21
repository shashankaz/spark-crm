import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteDialog } from "@/components/shared/dashboard/delete-dialog";

import { deleteTenantById } from "@/api/services/tenant.service";

import type { Tenant } from "@/types";

export const ActionCell = ({ tenant }: { tenant: Tenant }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteTenant, isPending } = useMutation({
    mutationFn: () => deleteTenantById({ id: tenant._id }),
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["getAllTenants"] });
      setDeleteOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
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
            onClick={() => navigate(`/admin/tenants/${tenant._id}/edit`)}
            disabled={isPending}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
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
        onConfirm={() => deleteTenant()}
        placeholder="tenant"
      />
    </>
  );
};
