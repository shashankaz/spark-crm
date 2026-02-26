"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deal = void 0;
const mongoose_1 = require("mongoose");
const dealSchema = new mongoose_1.Schema({
    idempotentId: {
        type: mongoose_1.Schema.Types.UUID,
        required: true,
        unique: true,
    },
    tenantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tenant",
        required: true,
    },
    leadId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Lead",
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
    value: {
        type: Number,
        default: 0,
    },
    probability: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
}, {
    timestamps: true,
    collection: "deals",
    versionKey: "version",
});
dealSchema.index({ tenantId: 1, leadId: 1 });
exports.Deal = (0, mongoose_1.model)("Deal", dealSchema);
