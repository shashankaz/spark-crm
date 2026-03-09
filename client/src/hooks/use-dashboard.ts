import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getCallActivity,
  getConversionFunnel,
  getDealPipeline,
  getDealWinRate,
  getLeadScore,
  getLeadSources,
  getLeadStatus,
  getMonthlyRevenue,
  getOrgIndustry,
  getRevenueTarget,
} from "@/api/services";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCallActivity = () => {
  return useQuery({
    queryKey: ["dashboard", "call-activity"],
    queryFn: getCallActivity,
    staleTime: 1000 * 60 * 5,
  });
};

export const useConversionFunnel = () => {
  return useQuery({
    queryKey: ["dashboard", "conversion-funnel"],
    queryFn: getConversionFunnel,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDealPipeline = () => {
  return useQuery({
    queryKey: ["dashboard", "deal-pipeline"],
    queryFn: getDealPipeline,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDealWinRate = () => {
  return useQuery({
    queryKey: ["dashboard", "deal-win-rate"],
    queryFn: getDealWinRate,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLeadScore = () => {
  return useQuery({
    queryKey: ["dashboard", "lead-score"],
    queryFn: getLeadScore,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLeadSources = () => {
  return useQuery({
    queryKey: ["dashboard", "lead-sources"],
    queryFn: getLeadSources,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLeadStatus = () => {
  return useQuery({
    queryKey: ["dashboard", "lead-status"],
    queryFn: getLeadStatus,
    staleTime: 1000 * 60 * 5,
  });
};

export const useMonthlyRevenue = () => {
  return useQuery({
    queryKey: ["dashboard", "monthly-revenue"],
    queryFn: getMonthlyRevenue,
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrgIndustry = () => {
  return useQuery({
    queryKey: ["dashboard", "org-industry"],
    queryFn: getOrgIndustry,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRevenueTarget = () => {
  return useQuery({
    queryKey: ["dashboard", "revenue-target"],
    queryFn: getRevenueTarget,
    staleTime: 1000 * 60 * 5,
  });
};
