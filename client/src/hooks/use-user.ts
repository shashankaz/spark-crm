import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "@/context/user-context";
import { buildQueryParams } from "@/api/query-params";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  exportUsers,
  generatePassword,
} from "@/api/services";

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined)
    throw new Error("useUser must be used within a UserProvider");

  return context;
};

export const useUsers = ({
  cursor,
  limit = 10,
  search,
  role,
}: {
  cursor?: string;
  limit?: number;
  search?: string;
  role?: string;
}) => {
  const query = buildQueryParams({ cursor, limit, search, role });

  return useQuery({
    queryKey: ["users", query],
    queryFn: () => getAllUsers({ cursor, limit, search, role }),
  });
};

export const useUserById = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById({ id }),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({
        queryKey: ["user", variables.id],
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.removeQueries({
        queryKey: ["user", variables.id],
      });
    },
  });
};

export const useExportUsers = () => {
  return useMutation({
    mutationFn: exportUsers,
  });
};

export const useGeneratePassword = () => {
  return useMutation({
    mutationFn: generatePassword,
  });
};
