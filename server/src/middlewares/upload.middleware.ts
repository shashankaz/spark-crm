import multer, { diskStorage } from "multer";
import os from "os";
import path from "path";
import { AppError } from "../shared/app-error";

const ALLOWED_MIMETYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const ALLOWED_EXTENSIONS = [".csv", ".xls", ".xlsx"];

export const upload = multer({
  storage: diskStorage({
    destination: os.tmpdir(),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `lead-import-${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isMimeAllowed = ALLOWED_MIMETYPES.includes(file.mimetype);
    const isExtAllowed = ALLOWED_EXTENSIONS.includes(ext);

    if (isMimeAllowed || isExtAllowed) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          "Only CSV and Excel (.xlsx / .xls) files are allowed",
          400,
        ),
      );
    }
  },
});
