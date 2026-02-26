import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { env } from "../config/env.js";
import { s3 } from "../utils/s3.js";

export const generateUploadUrlService = async (
  fileName: string,
  fileType: string,
  userId: string,
) => {
  const key = `users/${userId}/${randomUUID()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5,
  });

  return {
    signedUrl,
    key,
    fileUrl: `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`,
  };
};
