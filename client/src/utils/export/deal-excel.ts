import * as XLSX from "xlsx";

import type { Deal } from "@/types";

export const exportDealsToExcel = (deals: Deal[], filename = "deals") => {
  const rows = deals.map((deal) => ({
    ID: deal._id,
    Name: deal.name ?? "",
    Value: deal.value ?? 0,
    "Probability (%)": deal.probability ?? 0,
    "Last Modified": deal.updatedAt ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Deals");

  const columnWidths = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((row) => String(row[key as keyof typeof row] ?? "").length),
    ),
  }));
  worksheet["!cols"] = columnWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
