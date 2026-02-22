import * as XLSX from "xlsx";

import type { Lead } from "@/types";

export const exportLeadsToExcel = (leads: Lead[], filename = "leads") => {
  const rows = leads.map((lead) => ({
    ID: lead._id,
    "First Name": lead.firstName,
    "Last Name": lead.lastName ?? "",
    Organization: lead.orgName,
    Email: lead.email,
    Score: lead.score,
    "Last Modified": lead.updatedAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");

  const columnWidths = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((row) => String(row[key as keyof typeof row] ?? "").length),
    ),
  }));
  worksheet["!cols"] = columnWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
