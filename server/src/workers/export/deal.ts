import { formatDate } from "date-fns/format";
import { stringify } from "csv-stringify/sync";
import { Deal } from "../../modules/deal/models/deal.model";
import { uploadCsvToS3 } from "../../utils/upload-csv-to-s3";
import { sendDealExportMail } from "../../utils/mail/email.helper";
import { DealExportJobPayload } from "../../utils/export/export.types";

export const processDealExport = async (payload: DealExportJobPayload) => {
  const { tenantId, dealIds, recipientEmail } = payload;

  const deals = await Deal.find({ _id: { $in: dealIds }, tenantId }).lean();
  if (deals.length === 0) {
    console.warn("[ExportWorker] No deals found for payload:", payload);
    return;
  }

  const rows = deals.map((deal) => ({
    ID: String(deal._id),
    Name: deal.name ?? "",
    Value: deal.value ?? 0,
    "Probability (%)": deal.probability ?? 0,
    "Updated At": deal.updatedAt
      ? formatDate(deal.updatedAt, "dd/MM/yyyy")
      : "",
  }));

  const csvBuffer = Buffer.from(stringify(rows, { header: true }), "utf-8");
  const signedUrl = await uploadCsvToS3(csvBuffer, "deals", String(tenantId));
  await sendDealExportMail(recipientEmail, signedUrl, deals.length);
};
