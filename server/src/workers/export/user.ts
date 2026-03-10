import { formatDate } from "date-fns/format";
import { stringify } from "csv-stringify/sync";
import { User } from "../../models/user.model";
import { uploadCsvToS3 } from "../../utils/upload-csv-to-s3";
import { sendUserExportMail } from "../../services/email.service";
import { UserExportJobPayload } from "../../types/services/export.service.types";

export const processUserExport = async (payload: UserExportJobPayload) => {
  const { tenantId, userIds, recipientEmail } = payload;

  const users = await User.find({ _id: { $in: userIds }, tenantId }).lean();
  if (users.length === 0) {
    console.warn("[ExportWorker] No users found for payload:", payload);
    return;
  }

  const rows = users.map((user) => ({
    ID: String(user._id),
    "First Name": user.firstName ?? "",
    "Last Name": user.lastName ?? "",
    Email: user.email ?? "",
    Mobile: user.mobile ?? "",
    Role: user.role ? user.role[0].toUpperCase() + user.role.slice(1) : "",
    "Updated At": user.updatedAt
      ? formatDate(user.updatedAt, "dd/MM/yyyy")
      : "",
  }));

  const csvBuffer = Buffer.from(stringify(rows, { header: true }), "utf-8");
  const signedUrl = await uploadCsvToS3(csvBuffer, "users", String(tenantId));
  await sendUserExportMail(recipientEmail, signedUrl, users.length);
};
