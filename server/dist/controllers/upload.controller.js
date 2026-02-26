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
exports.generateUploadUrl = void 0;
const upload_service_1 = require("../services/upload.service");
const async_handler_1 = require("../shared/async-handler");
const api_response_1 = require("../shared/api-response");
exports.generateUploadUrl = (0, async_handler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileName, fileType } = req.body;
    const { _id: userId } = req.user;
    const data = yield (0, upload_service_1.generateUploadUrlService)(fileName, fileType, userId);
    (0, api_response_1.sendSuccess)(res, 200, "Signed URL generated successfully", { data });
}));
