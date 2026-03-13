import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  Star,
  StarOff,
  Mail,
  Phone,
  Building2,
  MoreHorizontal,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteDialog } from "@/components/shared/dashboard/delete-dialog";

import { useToggleContactStar, useDeleteContact } from "@/hooks";

import type { IContact } from "@/types/domain";

interface ContactCardProps {
  contact: IContact;
}

export const ContactCard = ({ contact }: ContactCardProps) => {
  const initials =
    `${contact.firstName[0]}${contact.lastName?.[0] ?? ""}`.toUpperCase();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const navigate = useNavigate();

  const { mutate: toggleStar, isPending } = useToggleContactStar();
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteContact();

  const handleToggleStar = () => {
    toggleStar(
      { id: contact._id },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteContact(
      { id: contact._id },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      },
    );
  };

  return (
    <div className="group relative rounded-xl border bg-card p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm truncate">
              {contact.firstName} {contact.lastName}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleToggleStar}
                disabled={isPending || isDeleting}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-amber-500"
              >
                {contact.starred ? (
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ) : (
                  <StarOff className="h-3.5 w-3.5" />
                )}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isPending || isDeleting}
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(`/dashboard/contacts/${contact._id}/edit`)
                    }
                    disabled={isPending || isDeleting}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleteOpen(true)}
                    disabled={isPending || isDeleting}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {contact.jobTitle && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {contact.jobTitle}
            </p>
          )}

          {contact.orgName && (
            <div className="flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                {contact.orgName}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate max-w-35">{contact.email}</span>
            </a>
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3 w-3 shrink-0" />
                <span>{contact.phone}</span>
              </a>
            )}
          </div>

          <DeleteDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDelete}
            placeholder="contact"
          />
        </div>
      </div>
    </div>
  );
};
