import { Router } from "express";
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
} from "./dashboard.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", requireAuth, getDashboardStats);
router.get("/call-activity", requireAuth, getCallActivity);
router.get("/conversion-funnel", requireAuth, getConversionFunnel);
router.get("/deal-pipeline", requireAuth, getDealPipeline);
router.get("/deal-win-rate", requireAuth, getDealWinRate);
router.get("/lead-score", requireAuth, getLeadScore);
router.get("/lead-sources", requireAuth, getLeadSources);
router.get("/lead-status", requireAuth, getLeadStatus);
router.get("/monthly-revenue", requireAuth, getMonthlyRevenue);
router.get("/org-industry", requireAuth, getOrgIndustry);
router.get("/revenue-target", requireAuth, getRevenueTarget);

export default router;
