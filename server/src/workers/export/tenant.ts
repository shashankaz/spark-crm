import { formatDate } from "date-fns/format";
import { stringify } from "csv-stringify/sync";
import { Tenant } from "../../models/tenant.model";
import { uploadCsvToS3 } from "../../utils/upload-csv-to-s3";
import { sendTenantExportMail } from "../../services/email.service";
import { TenantExportJobPayload } from "../../types/services/export.service.types";

export const processTenantExport = async (payload: TenantExportJobPayload) => {
  const { tenantIds, recipientEmail } = payload;

  const tenants = await Tenant.find({ _id: { $in: tenantIds } }).lean();
  if (tenants.length === 0) {
    console.warn("[ExportWorker] No tenants found for payload:", payload);
    return;
  }

  const rows = tenants.map((tenant) => ({
    ID: String(tenant._id),
    Name: tenant.name ?? "",
    Email: tenant.email ?? "",
    Mobile: tenant.mobile ?? "",
    Country: tenant.address?.country ?? "",
    Plan: tenant.plan
      ? tenant.plan[0].toUpperCase() + tenant.plan.slice(1)
      : "",
    "Updated At": tenant.updatedAt
      ? formatDate(tenant.updatedAt, "dd/MM/yyyy")
      : "",
  }));

  const csvBuffer = Buffer.from(stringify(rows, { header: true }), "utf-8");
  const signedUrl = await uploadCsvToS3(csvBuffer, "tenants", "superadmin");
  await sendTenantExportMail(recipientEmail, signedUrl, tenants.length);
};
