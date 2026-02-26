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
exports.Organization = void 0;
const mongoose_1 = require("mongoose");
const organizationSchema = new mongoose_1.Schema({
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
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    industry: {
        type: String,
        enum: [
            "technology",
            "finance",
            "healthcare",
            "education",
            "retail",
            "manufacturing",
            "real estate",
            "other",
        ],
    },
    size: {
        type: String,
        enum: ["smb", "mid-market", "enterprise"],
    },
    country: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    mobile: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    contactName: {
        type: String,
        trim: true,
    },
    contactEmail: {
        type: String,
        trim: true,
    },
    contactMobile: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    collection: "organizations",
    versionKey: "version",
});
organizationSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.email)
            this.email = this.email.toLowerCase();
        if (this.contactEmail)
            this.contactEmail = this.contactEmail.toLowerCase();
    });
});
exports.Organization = (0, mongoose_1.model)("Organization", organizationSchema);
