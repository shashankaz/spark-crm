import type { ReactNode } from "react";
import {
  FileEdit,
  MessageSquare,
  Phone,
  UserPlus,
  UserCheck,
  UserX,
  TrendingUp,
  Star,
  User,
  Trash2,
} from "lucide-react";

import type { ActionType } from "@/types/domain/lead-action-history";

export const getActivityStyle = (
  type: ActionType,
): {
  dot: string;
  icon: ReactNode;
} => {
  switch (type) {
    case "lead_created":
      return {
        dot: "bg-emerald-500 border-emerald-500",
        icon: <UserPlus className="h-2 w-2 text-white" />,
      };

    case "lead_updated":
      return {
        dot: "bg-blue-500 border-blue-500",
        icon: <FileEdit className="h-2 w-2 text-white" />,
      };

    case "lead_deleted":
      return {
        dot: "bg-red-500 border-red-500",
        icon: <Trash2 className="h-2 w-2 text-white" />,
      };

    case "lead_contacted":
      return {
        dot: "bg-indigo-500 border-indigo-500",
        icon: <Phone className="h-2 w-2 text-white" />,
      };

    case "lead_qualified":
      return {
        dot: "bg-teal-500 border-teal-500",
        icon: <UserCheck className="h-2 w-2 text-white" />,
      };

    case "lead_converted":
      return {
        dot: "bg-green-600 border-green-600",
        icon: <TrendingUp className="h-2 w-2 text-white" />,
      };

    case "lead_lost":
      return {
        dot: "bg-rose-500 border-rose-500",
        icon: <UserX className="h-2 w-2 text-white" />,
      };

    case "lead_call_logged":
      return {
        dot: "bg-violet-500 border-violet-500",
        icon: <Phone className="h-2 w-2 text-white" />,
      };

    case "lead_commented":
      return {
        dot: "bg-sky-500 border-sky-500",
        icon: <MessageSquare className="h-2 w-2 text-white" />,
      };

    case "lead_score_updated":
      return {
        dot: "bg-amber-500 border-amber-500",
        icon: <Star className="h-2 w-2 text-white" />,
      };

    case "lead_assigned":
      return {
        dot: "bg-cyan-500 border-cyan-500",
        icon: <User className="h-2 w-2 text-white" />,
      };

    default:
      return {
        dot: "bg-gray-400 border-gray-400",
        icon: <User className="h-2 w-2 text-white" />,
      };
  }
};
