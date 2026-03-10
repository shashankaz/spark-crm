import { useState } from "react";
import { UserCheck, Search, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useUsers } from "@/hooks";

import type { User } from "@/types/domain";

type AssignLeadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string) => void;
  isPending: boolean;
};

const roleColors: Record<
  User["role"],
  "link" | "secondary" | "default" | "destructive" | "outline" | "ghost"
> = {
  user: "secondary",
  admin: "default",
  super_admin: "destructive",
};

const roleLabels: Record<User["role"], string> = {
  user: "User",
  admin: "Admin",
  super_admin: "Super Admin",
};

export const AssignLeadModal = ({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: AssignLeadModalProps) => {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data, isPending: isLoadingUsers } = useUsers({
    search,
    limit: 20,
  });

  const users = data?.users ?? [];

  const handleConfirm = () => {
    if (!selectedUserId) return;
    onConfirm(selectedUserId);
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      setSearch("");
      setSelectedUserId(null);
    }
    onOpenChange(val);
  };

  const getInitials = (user: User) => {
    const first = user.firstName?.[0] ?? "";
    const last = user.lastName?.[0] ?? "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserCheck className="h-5 w-5 text-primary" />
            Assign Lead
          </DialogTitle>
          <DialogDescription>
            Select a user to assign this lead to. Only users within your tenant
            are shown.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="assign-lead-search"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-64 overflow-y-auto rounded-md border divide-y">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No users found
            </div>
          ) : (
            users.map((user) => {
              const isSelected = selectedUserId === user._id;
              return (
                <button
                  key={user._id}
                  id={`assign-user-${user._id}`}
                  type="button"
                  onClick={() => setSelectedUserId(user._id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus:outline-none ${
                    isSelected
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : ""
                  }`}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback
                      className={`text-xs font-semibold ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <Badge
                    variant={roleColors[user.role]}
                    className="shrink-0 text-xs"
                  >
                    {roleLabels[user.role]}
                  </Badge>
                </button>
              );
            })
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            id="assign-lead-confirm-btn"
            onClick={handleConfirm}
            disabled={!selectedUserId || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Assign
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
