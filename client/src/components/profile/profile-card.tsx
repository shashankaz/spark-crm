import { Mail, Phone, Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { User } from "@/types";

interface ProfileCardProps {
  user: User;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="h-full">
      <Card className="h-full">
        <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
          <Avatar className="size-20 text-2xl">
            <AvatarFallback className="text-xl">
              {user.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg leading-tight">
              {user.firstName} {user.lastName}
            </p>
          </div>
          <Badge variant={user.role === "user" ? "secondary" : "default"}>
            {user.role === "super_admin"
              ? "Super Admin"
              : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>

          <Separator />

          <div className="w-full space-y-2 text-sm text-left">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{user.mobile}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>Joined {user.createdAt}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
