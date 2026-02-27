import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { Types } from "mongoose";
import { env } from "../config/env";
import { s3 } from "../utils/s3";

export const generateUploadUrlService = async ({
  type,
  fileName,
  fileType,
  userId,
}: {
  type: string;
  fileName: string;
  fileType: string;
  userId: Types.ObjectId;
}) => {
  const key = `${type}/${userId}/${randomUUID()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5,
  });

  return {
    signedUrl,
    key,
    fileUrl: `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`,
  };
};
