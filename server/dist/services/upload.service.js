"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUploadUrlService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const crypto_1 = require("crypto");
const env_js_1 = require("../config/env.js");
const s3_js_1 = require("../utils/s3.js");
const generateUploadUrlService = (fileName, fileType, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `users/${userId}/${(0, crypto_1.randomUUID)()}-${fileName}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: env_js_1.env.AWS_BUCKET_NAME,
        Key: key,
        ContentType: fileType,
    });
    const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3_js_1.s3, command, {
        expiresIn: 60 * 5,
    });
    return {
        signedUrl,
        key,
        fileUrl: `https://${env_js_1.env.AWS_BUCKET_NAME}.s3.${env_js_1.env.AWS_REGION}.amazonaws.com/${key}`,
    };
});
exports.generateUploadUrlService = generateUploadUrlService;
