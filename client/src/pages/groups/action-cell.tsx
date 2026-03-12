import { useState } from "react";
import { EllipsisVertical, Mail, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { DeleteDialog } from "@/components/shared/dashboard/delete-dialog";

import { SendCampaignForm } from "./send-campaign-form";

import { useDeleteGroup } from "@/hooks";

import type { Group } from "@/types/domain";

export const ActionCell = ({ group }: { group: Group }) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [campaignOpen, setCampaignOpen] = useState(false);

  const { mutate: deleteMutate, isPending: isDeleting } = useDeleteGroup();

  const handleDelete = () => {
    deleteMutate(
      { id: group._id },
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
          <DropdownMenuItem onClick={() => setCampaignOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Campaign
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
        placeholder="group"
      />

      <Dialog open={campaignOpen} onOpenChange={setCampaignOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Send Campaign</DialogTitle>
          </DialogHeader>
          <SendCampaignForm groupId={group._id} setOpen={setCampaignOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
};
