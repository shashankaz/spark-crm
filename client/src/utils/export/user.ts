import * as XLSX from "xlsx";

import type { User } from "@/types";

export const exportUsersToExcel = (users: User[], filename = "users") => {
  const rows = users.map((user) => ({
    ID: user._id,
    "First Name": user.firstName ?? "",
    Email: user.email ?? "",
    Mobile: user.mobile ?? "",
    Role: user.role ? user.role[0].toUpperCase() + user.role.slice(1) : "",
    "Last Modified": user.updatedAt ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  const columnWidths = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...rows.map((row) => String(row[key as keyof typeof row] ?? "").length),
    ),
  }));
  worksheet["!cols"] = columnWidths;

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};
