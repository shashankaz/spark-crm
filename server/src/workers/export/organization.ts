import { formatDate } from "date-fns/format";
import { stringify } from "csv-stringify/sync";
import { Organization } from "../../models/organization.model";
import { uploadCsvToS3 } from "../../utils/upload-csv-to-s3";
import { sendOrganizationExportMail } from "../../services/email.service";
import { OrganizationExportJobPayload } from "../../types/services/export.service.types";

export const processOrganizationExport = async (
  payload: OrganizationExportJobPayload,
) => {
  const { tenantId, organizationIds, recipientEmail } = payload;

  const orgs = await Organization.find({
    _id: { $in: organizationIds },
    tenantId,
  }).lean();
  if (orgs.length === 0) {
    console.warn("[ExportWorker] No organizations found for payload:", payload);
    return;
  }

  const rows = orgs.map((org) => ({
    ID: String(org._id),
    Name: org.name ?? "",
    Industry: org.industry
      ? org.industry[0].toUpperCase() + org.industry.slice(1)
      : "",
    Country: org.country ?? "",
    Size: org.size?.toUpperCase() ?? "",
    Website: org.website ?? "",
    "Updated At": org.updatedAt ? formatDate(org.updatedAt, "dd/MM/yyyy") : "",
  }));

  const csvBuffer = Buffer.from(stringify(rows, { header: true }), "utf-8");
  const signedUrl = await uploadCsvToS3(
    csvBuffer,
    "organizations",
    String(tenantId),
  );
  await sendOrganizationExportMail(recipientEmail, signedUrl, orgs.length);
};
