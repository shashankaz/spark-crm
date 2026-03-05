import { Request, Response, NextFunction } from "express";
import { validateWebhookTokenService } from "../services/webhook.service";
import { AppError } from "../shared/app-error";

export const webhookAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const apiKey =
      (req.headers["x-webhook-api-key"] as string) ||
      (req.query.api_key as string);

    if (!apiKey) {
      throw new AppError(
        "API key is required. Provide it via X-Webhook-Api-Key header or api_key query param.",
        401,
      );
    }

    const webhookToken = await validateWebhookTokenService(apiKey);
    req.webhookTenantId = webhookToken.tenantId;
    next();
  } catch (error) {
    next(error);
  }
};
