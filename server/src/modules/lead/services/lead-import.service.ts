import fs from "fs";
import path from "path";
import csv from "csv-parser";
import * as XLSX from "xlsx";
import { Types } from "mongoose";
import { v7 as uuidv7 } from "uuid";
import { Lead } from "../models/lead.model";
import { ILeadBase } from "../models/lead.model.types";
import { calculateLeadScore } from "../../../utils/calculate-score";
import {
  IImportLeadsInput,
  IImportLeadsResult,
} from "./lead-import.service.types";

const BATCH_SIZE = 100;

const VALID_GENDERS = ["male", "female", "other"];
const VALID_STATUSES = ["new", "contacted", "qualified", "converted", "lost"];

const buildLeadDocument = (
  row: Record<string, any>,
  tenantId: Types.ObjectId,
  userId: Types.ObjectId,
): ILeadBase | null => {
  if (!row.firstName || !row.email || !row.mobile) return null;

  const document: ILeadBase = {
    idempotentId: new Types.UUID(uuidv7()),
    tenantId,
    userId,
    firstName: String(row.firstName).trim(),
    lastName: row.lastName ? String(row.lastName).trim() : undefined,
    email: String(row.email).toLowerCase().trim(),
    mobile: String(row.mobile).trim(),
    gender: VALID_GENDERS.includes(String(row.gender || "").toLowerCase())
      ? (String(row.gender).toLowerCase() as ILeadBase["gender"])
      : "other",
    source: row.source ? String(row.source).trim() : "Import",
    score: 0,
    status: VALID_STATUSES.includes(String(row.status || "").toLowerCase())
      ? (String(row.status).toLowerCase() as ILeadBase["status"])
      : "new",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  document.score = calculateLeadScore(document);
  return document;
};

const processBatch = async (
  batch: Record<string, any>[],
  tenantId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<{ inserted: number; failed: number; failedLeadIds: string[] }> => {
  if (!batch.length) return { inserted: 0, failed: 0, failedLeadIds: [] };

  let inserted = 0;
  let failed = 0;
  const failedLeadIds: string[] = [];

  const operations = batch
    .map((row) => {
      const doc = buildLeadDocument(row, tenantId, userId);
      if (!doc) {
        failed++;
        failedLeadIds.push(String(row.email || row.firstName || "unknown"));
        return null;
      }
      return { insertOne: { document: doc } };
    })
    .filter((op): op is { insertOne: { document: ILeadBase } } => op !== null);

  if (operations.length > 0) {
    try {
      const result = await Lead.bulkWrite(operations, { ordered: false });
      inserted += result.insertedCount;
    } catch (error: any) {
      if (error.result?.insertedCount !== undefined) {
        inserted += error.result.insertedCount;
      }
      if (error.writeErrors) {
        error.writeErrors.forEach((err: any) => {
          failed++;
          failedLeadIds.push(err?.err?.op?.email || "unknown");
        });
      }
    }
  }

  return { inserted, failed, failedLeadIds };
};

const importFromCsv = async (
  filePath: string,
  tenantId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<IImportLeadsResult> => {
  return new Promise((resolve, reject) => {
    let totalInserted = 0;
    let totalFailed = 0;
    const allFailedIds: string[] = [];
    let batch: Record<string, any>[] = [];

    const stream = fs.createReadStream(filePath).pipe(csv());

    stream.on("data", (data) => {
      batch.push(data);
      if (batch.length >= BATCH_SIZE) {
        stream.pause();
        const currentBatch = batch;
        batch = [];
        processBatch(currentBatch, tenantId, userId)
          .then(({ inserted, failed, failedLeadIds }) => {
            totalInserted += inserted;
            totalFailed += failed;
            allFailedIds.push(...failedLeadIds);
            stream.resume();
          })
          .catch(reject);
      }
    });

    stream.on("end", async () => {
      try {
        if (batch.length > 0) {
          const { inserted, failed, failedLeadIds } = await processBatch(
            batch,
            tenantId,
            userId,
          );
          totalInserted += inserted;
          totalFailed += failed;
          allFailedIds.push(...failedLeadIds);
        }
        resolve({
          inserted: totalInserted,
          failed: totalFailed,
          failedLeadIds: allFailedIds,
        });
      } catch (err) {
        reject(err);
      }
    });

    stream.on("error", reject);
  });
};

const importFromXlsx = async (
  filePath: string,
  tenantId: Types.ObjectId,
  userId: Types.ObjectId,
): Promise<IImportLeadsResult> => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
  });

  let totalInserted = 0;
  let totalFailed = 0;
  const allFailedIds: string[] = [];

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batchSlice = rows.slice(i, i + BATCH_SIZE);
    const { inserted, failed, failedLeadIds } = await processBatch(
      batchSlice,
      tenantId,
      userId,
    );
    totalInserted += inserted;
    totalFailed += failed;
    allFailedIds.push(...failedLeadIds);
  }

  return {
    inserted: totalInserted,
    failed: totalFailed,
    failedLeadIds: allFailedIds,
  };
};

export const importLeadsService = async ({
  filePath,
  tenantId,
  userId,
}: IImportLeadsInput): Promise<IImportLeadsResult> => {
  const ext = path.extname(filePath).toLowerCase();
  let result: IImportLeadsResult;

  try {
    if (ext === ".xlsx" || ext === ".xls") {
      result = await importFromXlsx(filePath, tenantId, userId);
    } else {
      result = await importFromCsv(filePath, tenantId, userId);
    }
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  return result;
};
