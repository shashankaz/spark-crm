"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Call = void 0;
const mongoose_1 = require("mongoose");
const callSchema = new mongoose_1.Schema({
    leadId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Lead",
        required: true,
    },
    type: {
        type: String,
        enum: ["inbound", "outbound"],
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["completed", "missed", "cancelled"],
        required: true,
    },
    duration: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: false,
    collection: "calls",
    versionKey: "version",
});
callSchema.index({ leadId: 1 });
exports.Call = (0, mongoose_1.model)("Call", callSchema);
