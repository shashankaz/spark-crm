import * as XLSX from "xlsx";

import type { Tenant } from "@/types";

export const exportTenantsToExcel = (
  tenants: Tenant[],
  filename = "tenants",
) => {
  const rows = tenants.map((tenant) => ({
    ID: tenant._id,
    Name: tenant.name ?? "",
    Email: tenant.email ?? "",
    Mobile: tenant.mobile ?? "",
    Country: tenant.address?.country ?? "",
    Plan: tenant.plan
      ? tenant.plan[0].toUpperCase() + tenant.plan.slice(1)
      : "",
    "Last Modified": tenant.updatedAt ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Tenants");

  const columnWidths = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((row) => String(row[key as keyof typeof row] ?? "").length),
    ),
  }));
  worksheet["!cols"] = columnWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
