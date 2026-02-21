import { Mail, Phone, ShieldCheck, Calendar } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfileCardProps {
  user: {
    name: string;
    jobTitle: string;
    email: string;
    mobile: string;
    department: string;
    joinedAt: string;
    role: "Admin" | "User";
    avatarUrl?: string;
  };
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="h-full">
      <Card className="h-full">
        <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
          <Avatar className="size-20 text-2xl">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="text-xl">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg leading-tight">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.jobTitle}</p>
          </div>
          <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
            {user.role}
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
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{user.department}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>
                Joined{" "}
                {new Date(user.joinedAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
