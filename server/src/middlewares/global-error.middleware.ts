import { AppError } from "../shared/app-error.js";

export const globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        details: err.details ?? null,
      },
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: {
      details: null,
    },
  });
};
