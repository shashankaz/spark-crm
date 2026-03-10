import fs from "fs";
import csv from "csv-parser";
import { Types } from "mongoose";
import { v7 as uuidv7 } from "uuid";
import { Lead } from "../models/lead.model";
import { calculateLeadScore } from "../utils/calculate-score";
import { LeadBase } from "../types/models/lead.model.types";
import {
  ImportLeadsInput,
  ImportLeadsResult,
} from "../types/services/lead-import.service.types";

export const importLeadsService = async ({
  filePath,
  tenantId,
  userId,
}: ImportLeadsInput): Promise<ImportLeadsResult> => {
  return new Promise((resolve, reject) => {
    const failedLeadIds: string[] = [];
    let inserted = 0;
    let failed = 0;

    const BATCH_SIZE = 1000;

    const processBatch = async (batch: any[]) => {
      if (batch.length === 0) return;

      const operations = batch
        .map((row) => {
          if (!row.firstName || !row.email || !row.mobile) {
            failed++;
            failedLeadIds.push(row.email || row.idempotentId);
            return null;
          }

          const document: LeadBase = {
            idempotentId: new Types.UUID(uuidv7()),
            tenantId,
            userId,
            firstName: row.firstName.trim(),
            lastName: row.lastName ? row.lastName.trim() : undefined,
            email: row.email.toLowerCase(),
            mobile: row.mobile,
            gender: ["male", "female", "other"].includes(
              row.gender?.toLowerCase(),
            )
              ? row.gender.toLowerCase()
              : "other",
            source: row.source ? row.source : "CSV Import",
            score: 0,
            status: ([
              "new",
              "contacted",
              "qualified",
              "converted",
              "lost",
            ].includes(row.status?.toLowerCase())
              ? row.status.toLowerCase()
              : "new") as LeadBase["status"],
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          document.score = calculateLeadScore(document);

          return { insertOne: { document } };
        })
        .filter(
          (op): op is { insertOne: { document: LeadBase } } => op !== null,
        );

      if (operations.length > 0) {
        try {
          const bulkResult = await Lead.bulkWrite(operations, {
            ordered: false,
          });
          inserted += bulkResult.insertedCount;
        } catch (error: any) {
          if (error.result && error.result.insertedCount !== undefined) {
            inserted += error.result.insertedCount;
          }
          if (error.writeErrors) {
            error.writeErrors.forEach((err: any) => {
              failed++;
              const failedEmail = err?.err?.op?.email || "Unknown";
              failedLeadIds.push(failedEmail);
            });
          }
        }
      }
    };

    const stream = fs.createReadStream(filePath).pipe(csv());

    let batch: any[] = [];

    stream.on("data", (data) => {
      const row = {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        email: data.email || undefined,
        mobile: data.mobile || undefined,
        gender: data.gender || undefined,
        source: data.source || undefined,
        status: data.status || undefined,
      };

      batch.push(row);
      if (batch.length >= BATCH_SIZE) {
        stream.pause();
        processBatch(batch)
          .then(() => {
            batch = [];
            stream.resume();
          })
          .catch((err) => {
            reject(err);
          });
      }
    });

    stream.on("end", async () => {
      try {
        if (batch.length > 0) {
          await processBatch(batch);
        }

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        resolve({
          inserted,
          failed,
          failedLeadIds,
        });
      } catch (error) {
        reject(error);
      }
    });

    stream.on("error", (error) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(error);
    });
  });
};
