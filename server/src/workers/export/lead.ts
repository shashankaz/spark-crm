import { formatDate } from "date-fns/format";
import { stringify } from "csv-stringify/sync";
import { Lead } from "../../models/lead.model";
import { uploadCsvToS3 } from "../../utils/upload-csv-to-s3";
import { sendLeadExportMail } from "../../services/email.service";
import { LeadExportJobPayload } from "../../types/services/export.service.types";

export const processLeadExport = async (payload: LeadExportJobPayload) => {
  const { tenantId, leadIds, recipientEmail } = payload;

  const leads = await Lead.find({ _id: { $in: leadIds }, tenantId }).lean();
  if (leads.length === 0) {
    console.warn("[ExportWorker] No leads found for payload:", payload);
    return;
  }

  const rows = leads.map((lead) => ({
    ID: String(lead._id),
    "First Name": lead.firstName ?? "",
    "Last Name": lead.lastName ?? "",
    Email: lead.email ?? "",
    Mobile: lead.mobile ?? "",
    Organization: lead.orgName ?? "",
    Gender: lead.gender ?? "",
    Source: lead.source ?? "",
    Score: lead.score ?? 0,
    Status: lead.status ?? "",
    "Created At": lead.createdAt
      ? formatDate(lead.createdAt, "dd/MM/yyyy")
      : "",
    "Updated At": lead.updatedAt
      ? formatDate(lead.updatedAt, "dd/MM/yyyy")
      : "",
  }));

  const csvBuffer = Buffer.from(stringify(rows, { header: true }), "utf-8");
  const signedUrl = await uploadCsvToS3(csvBuffer, "leads", String(tenantId));
  await sendLeadExportMail(recipientEmail, signedUrl, leads.length);
};
