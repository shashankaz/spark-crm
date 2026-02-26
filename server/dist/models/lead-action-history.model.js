"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadActionHistory = void 0;
const mongoose_1 = require("mongoose");
const leadActionHistorySchema = new mongoose_1.Schema({
    leadId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Lead",
    },
    actionType: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false,
    collection: "lead-action-history",
    versionKey: "version",
});
leadActionHistorySchema.index({ leadId: 1 });
exports.LeadActionHistory = (0, mongoose_1.model)("LeadActionHistory", leadActionHistorySchema);
