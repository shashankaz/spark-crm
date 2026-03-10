import { Request, Response } from "express";
import { researchLead } from "../services/langchain.service";
import { AppError } from "../shared/app-error";
import { sendSuccess } from "../shared/api-response";
import { asyncHandler } from "../shared/async-handler";

export const researchLeadController = asyncHandler(
  async (req: Request, res: Response) => {
    const { query } = req.body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      throw new AppError("A search query is required", 400);
    }

    const result = await researchLead(query.trim());

    sendSuccess(res, 200, "Lead research completed successfully", { result });
  },
);
