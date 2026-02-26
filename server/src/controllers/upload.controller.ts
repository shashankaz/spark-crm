import { Request, Response } from "express";
import { generateUploadUrlService } from "../services/upload.service";
import { asyncHandler } from "../shared/async-handler";
import { sendSuccess } from "../shared/api-response";

export const generateUploadUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { fileName, fileType } = req.body;
    const { _id: userId } = req.user;

    const data = await generateUploadUrlService(fileName, fileType, userId);

    sendSuccess(res, 200, "Signed URL generated successfully", { data });
  },
);
