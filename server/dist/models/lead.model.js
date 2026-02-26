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
exports.Lead = void 0;
const mongoose_1 = require("mongoose");
const leadSchema = new mongoose_1.Schema({
    idempotentId: {
        type: mongoose_1.Schema.Types.UUID,
        required: true,
        unique: true,
    },
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Tenant",
    },
    orgId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Organization",
    },
    orgName: {
        type: String,
        trim: true,
    },
    dealId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Deal",
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: true,
    },
    source: {
        type: String,
        trim: true,
    },
    score: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: "new",
        enum: ["new", "contacted", "qualified", "converted", "lost"],
    },
}, {
    timestamps: true,
    collection: "leads",
    versionKey: "version",
});
leadSchema.index({ tenantId: 1, userId: 1 });
leadSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.email)
            this.email = this.email.toLowerCase();
    });
});
exports.Lead = (0, mongoose_1.model)("Lead", leadSchema);
