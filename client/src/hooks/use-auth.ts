import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login,
  logout,
  refreshToken,
  getProfile,
  getSessions,
  editProfile,
  changePassword,
} from "@/api/services";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "sessions"] });
    },
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshToken,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "profile"] });
      queryClient.removeQueries({ queryKey: ["auth", "sessions"] });
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: getProfile,
    retry: false,
  });
};

export const useSessions = () => {
  return useQuery({
    queryKey: ["auth", "sessions"],
    queryFn: getSessions,
  });
};

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
