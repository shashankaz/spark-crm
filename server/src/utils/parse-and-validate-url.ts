import { AppError } from "../shared/app-error";

export const parseAndValidateUrl = ({ url }: { url: string }): URL => {
  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new AppError("Invalid url protocol", 400);
    }

    return parsedUrl;
  } catch {
    throw new AppError("Invalid url", 400);
  }
};
