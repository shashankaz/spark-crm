import * as XLSX from "xlsx";

import type { Organization } from "@/types";

export const exportOrganizationsToExcel = (
  organizations: Organization[],
  filename = "organizations",
) => {
  const rows = organizations.map((org) => ({
    ID: org._id,
    Name: org.name ?? "",
    Industry: org.industry
      ? org.industry[0].toUpperCase() + org.industry.slice(1)
      : "",
    Country: org.country ?? "",
    Size: org.size?.toUpperCase() ?? "",
    Website: org.website ?? "",
    "Last Modified": org.updatedAt ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Organizations");

  const columnWidths = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((row) => String(row[key as keyof typeof row] ?? "").length),
    ),
  }));
  worksheet["!cols"] = columnWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
