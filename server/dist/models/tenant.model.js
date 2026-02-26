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
exports.Tenant = void 0;
const mongoose_1 = require("mongoose");
const tenantSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    gstNumber: {
        type: String,
        trim: true,
    },
    panNumber: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        line1: {
            type: String,
            trim: true,
        },
        line2: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        postalCode: {
            type: String,
            trim: true,
        },
    },
    logoUrl: {
        type: String,
        trim: true,
    },
    plan: {
        type: String,
        enum: ["free", "basic", "pro", "enterprise"],
        default: "free",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
    },
}, {
    timestamps: true,
    collection: "tenants",
    versionKey: "version",
});
tenantSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.email)
            this.email = this.email.toLowerCase();
    });
});
exports.Tenant = (0, mongoose_1.model)("Tenant", tenantSchema);
