import { Request, Response } from "express";
import { generateUploadUrlService } from "../services/upload.service";
import { asyncHandler } from "../shared/async-handler";
import { sendSuccess } from "../shared/api-response";
import { AppError } from "../shared/app-error";

export const generateUploadUrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: userId } = req.user;

    const { type, fileName, fileType } = req.body;
    if (!type || !fileName || !fileType) {
      throw new AppError("Type, fileName and fileType are required", 400);
    }

    const data = await generateUploadUrlService({
      type,
      fileName,
      fileType,
      userId,
    });

    sendSuccess(res, 200, "Signed URL generated successfully", { data });
  },
);
