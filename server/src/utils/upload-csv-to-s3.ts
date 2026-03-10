import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { env } from "../config/env";
import { s3 } from "./s3";

export const uploadCsvToS3 = async (
  csvBuffer: Buffer,
  folder: string,
  tenantId: string,
): Promise<string> => {
  const s3Key = `exports/${folder}/${tenantId}/${randomUUID()}-${folder}.csv`;

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: s3Key,
      Body: csvBuffer,
      ContentType: "text/csv",
      ContentDisposition: `attachment; filename="${folder}-export.csv"`,
    }),
  );

  return getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: env.AWS_S3_BUCKET_NAME, Key: s3Key }),
    { expiresIn: 60 * 60 * 24 * 7 },
  );
};
